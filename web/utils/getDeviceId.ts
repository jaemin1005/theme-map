import { v4 } from "uuid";

/**
 * Device Id를 가져온다.
 * @returns deviceId
 */
export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = v4();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};
