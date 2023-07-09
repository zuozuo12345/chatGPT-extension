import { AxiosError } from "axios";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

interface getOtpCodeInterface {
  email: string;
}

/**
 * @desc API call to request OTP code.
 * @param email User's email.
 * @return API call's status response.
 */
export async function getOtpCode({ email }: getOtpCodeInterface) {
  try {
    const response = await axiosScoutBaseBackendInstance.get(
      `api/auth/code?email=${email}`
    );

    const { status } = response;

    return {
      status,
    };
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      if (
        (err.response.status === 401 || err.response.status === 400) &&
        err.response.data["detail"] &&
        typeof err.response.data["detail"] === "string"
      ) {
        throw err.response.status === 400
          ? "We could not find your account!"
          : err.response.data["detail"];
      }
    }

    throw "Failed to send otp";
  }
}

interface userLoginInterface {
  email: string;
  code: string;
}

interface userLoginResponseInterface {
  token: string;
  refresh_token: string;
}

/**
 * @desc API call to login.
 * @param email User's email.
 * @param code User's OTP code.
 * @return token (User's access token) and refresh_token (User's refresh token).
 */
export async function userLogin({ email, code }: userLoginInterface) {
  try {
    const response =
      await axiosScoutBaseBackendInstance.post<userLoginResponseInterface>(
        "api/auth/login",
        {
          email,
          code,
        }
      );
    const { token, refresh_token } = response.data;

    return {
      token,
      refresh_token,
    };
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      if (
        (err.response.status === 401 || err.response.status === 400) &&
        err.response.data["detail"] &&
        typeof err.response.data["detail"] === "string"
      ) {
        throw err.response.status === 400
          ? "We could not find your account!"
          : err.response.status === 401 &&
            err.response.data["detail"] === "Code expired"
          ? "Your OTP has expired, please try again."
          : err.response.data["detail"];
      } else if (err.response.status === 500) {
        throw "You've entered an incorrect OTP. Please try again.";
      }
    }

    throw error;
  }
}
