import { AxiosError } from "axios";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";
import axios from "axios";
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
    // const response = await axiosScoutBaseBackendInstance.get(
    //   `api/auth/code?email=${email}`
    // )

    // const response = await axiosScoutBaseBackendInstance.post(
    //   `/user/sendCode`,
    //   { phone: email },
    //   { headers: { "Content-Type": "application/json" } }
    // );
    const response = await axios.post(
      `http://localhost:8090/user/sendCode`,
      { phone: email },
      { headers: { "Content-Type": "application/json" } }
    );

    const { status } = response;
    console.log("response", response);
    return {
      status,
    };
  } catch (error) {
    const err = error as AxiosError;
    console.log(error);

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

    throw error;
  }
}

interface userLoginResponseInterface {
  token: string;
  refresh_token: string;
}

interface UserLoginInterface {
  userName?: string;
  password?: string;
  email?: string;
  phone?: string;
  code?: string;
}

/**
 * @desc API call to login.
 * @param phone User's phone.
 * @param code User's OTP code.
 * @param userName User's username
 * @param password User's password
 * @return token (User's access token) and refresh_token (User's refresh token).
 */

export async function userLogin({
  userName = null,
  password = null,
  phone = null,
  email = null,
  code = null,
}: UserLoginInterface) {
  try {
    // const response =
    //   await axiosScoutBaseBackendInstance.post<userLoginResponseInterface>(
    //     "api/auth/login",
    //     {
    //       email,
    //       code,
    //     }
    //   );

    const response = await axios.post(
      `http://localhost:8090/user/register`,
      {
        userName: userName,
        password: password,
        phone: phone,
        email: email,
        code: code,
      },
      {
        headers: { "Content-Type": "application/json" },
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
