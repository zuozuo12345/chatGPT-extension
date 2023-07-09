import * as Iron from "iron-webcrypto";
import {
  SCOUT_WEB_SECRET_COOKIE_PASSWORD,
  SCOUT_WEB_TOKEN_EXPIRY_IN_SECONDS,
} from "../scripts/scout/settings";

type passwordsMap = { [id: string]: string };
type password = string | passwordsMap;

const versionDelimiter = "~";

export function parseSeal(seal: string): {
  sealWithoutVersion: string;
  tokenVersion: number | null;
} {
  if (seal[seal.length - 2] === versionDelimiter) {
    const [sealWithoutVersion, tokenVersionAsString] =
      seal.split(versionDelimiter);
    return {
      sealWithoutVersion,
      tokenVersion: parseInt(tokenVersionAsString, 10),
    };
  }

  return { sealWithoutVersion: seal, tokenVersion: null };
}

export function normalizeStringPasswordToMap(password: password) {
  return typeof password === "string" ? { 1: password } : password;
}

export function createUnsealData(_crypto: Crypto) {
  return async <T = Record<string, unknown>>(
    seal: string,
    options: { password: password; ttl?: number } | null
  ): Promise<T> => {
    const options_ = {
      password:
        options && options.password
          ? options.password
          : SCOUT_WEB_SECRET_COOKIE_PASSWORD,
      ttl:
        options && options.ttl
          ? options.ttl
          : SCOUT_WEB_TOKEN_EXPIRY_IN_SECONDS,
    };

    const { password, ttl } = options_;

    const passwordsAsMap = normalizeStringPasswordToMap(password);
    const { sealWithoutVersion, tokenVersion } = parseSeal(seal);

    try {
      const data = await Iron.unseal(
        _crypto,
        sealWithoutVersion,
        passwordsAsMap,
        { ...Iron.defaults, ttl: ttl * 1000 }
      );

      if (tokenVersion === 2) {
        return data as T;
      }

      return {
        // @ts-expect-error `persistent` does not exist on newer tokens
        ...data.persistent,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "Expired seal" ||
          error.message === "Bad hmac value" ||
          error.message === "Cannot find password: " ||
          error.message === "Incorrect number of sealed components"
        ) {
          // if seal expired or
          // if seal is not valid (encrypted using a different password, when passwords are badly rotated) or
          // if we can't find back the password in the seal
          // then we just start a new session over
          return {} as T;
        }
      }

      throw error;
    }
  };
}

const getCrypto = (): Crypto => {
  if (typeof globalThis.crypto?.subtle === "object") return globalThis.crypto;
  // @ts-ignore crypto.webcrypto is not available in dom, but is there in newer node versions
  if (typeof globalThis.crypto?.webcrypto?.subtle === "object")
    // @ts-ignore same as above
    return globalThis.crypto.webcrypto;
  throw new Error(
    "no native implementation of WebCrypto is available in current context"
  );
};

const _crypto = getCrypto();

export const unsealData = createUnsealData(_crypto);
