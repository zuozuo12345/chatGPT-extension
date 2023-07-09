import {
  SESSION_TYPE,
  SESSION_TYPE_INTERFACE,
} from "../typescript/types/session";
import { loginProcessInterface } from "../typescript/types/storage";
import * as moment from "moment";

export async function getScoutWebTokenStorage(): Promise<string> {
  const scoutWebTokenResponse = await chrome.storage.sync.get([
    "scoutWebToken",
  ]);

  if (
    Object.keys(scoutWebTokenResponse).length > 0 &&
    "scoutWebToken" in scoutWebTokenResponse
  ) {
    return scoutWebTokenResponse["scoutWebToken"] ?? null;
  } else {
    return null;
  }
}

export async function getSessionTypeStorage(): Promise<SESSION_TYPE> {
  const sessionTypeResponse = await chrome.storage.sync.get(["sessionType"]);

  if (
    Object.keys(sessionTypeResponse).length > 0 &&
    "sessionType" in sessionTypeResponse
  ) {
    return sessionTypeResponse["sessionType"];
  } else {
    return "scout_web_app";
  }
}

export async function setSessionTypeStorage(
  val: SESSION_TYPE
): Promise<SESSION_TYPE | null> {
  try {
    chrome.storage.sync.set({
      sessionType: val,
    } as SESSION_TYPE_INTERFACE);

    return val;
  } catch (error) {
    return null;
  }
}

export async function getLoginProcessStorage(): Promise<loginProcessInterface> {
  try {
    const loginProcessResponse = await chrome.storage.sync.get([
      "loginProcess",
    ]);

    if (
      Object.keys(loginProcessResponse).length > 0 &&
      "loginProcess" in loginProcessResponse
    ) {
      const pass =
        loginProcessResponse["loginProcess"] &&
        loginProcessResponse["loginProcess"]["email"] &&
        loginProcessResponse["loginProcess"]["lastUpdatedAt"];

      if (pass) {
        const timeStamp = moment.utc(
          loginProcessResponse["loginProcess"]["lastUpdatedAt"]
        );
        const currentTime = moment.utc();

        const minuteDiff = currentTime.diff(timeStamp, "minutes");

        if (minuteDiff <= 5) {
          return {
            loginProcess: loginProcessResponse["loginProcess"],
          };
        } else {
          throw "Expired";
        }
      } else {
        throw "Doesn't have required fields";
      }
    } else {
      throw "Doesn't have required fields";
    }
  } catch (error) {
    return null;
  }
}

export async function setLoginProcessStorage(
  email: string,
  timestamp?: moment.Moment | null
): Promise<boolean> {
  try {
    await chrome.storage.sync.set({
      loginProcess: {
        email: email ?? null,
        lastUpdatedAt: timestamp ? timestamp.utc().format() : null,
      },
    } as loginProcessInterface);

    return true;
  } catch (error) {
    return false;
  }
}
