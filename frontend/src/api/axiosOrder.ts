import axios from "axios";
import { SCOUT_API_URL, SCOUT_WEB_URL } from "../scripts/scout/settings";

const axiosScoutBaseBackendInstance = axios.create({
  baseURL: SCOUT_API_URL,
});

const axiosScoutWebInstance = axios.create({
  baseURL: SCOUT_WEB_URL,
});

export { axiosScoutBaseBackendInstance, axiosScoutWebInstance };
