import { ERROR_MSG } from "@/static/log/error_msg";

export const startWatchingPosition = (
  setLocationCallback: (location: [number, number]) => void,
  onErrorCallback?: (error: GeolocationPositionError) => void
): number | null => {
  if (!("geolocation" in navigator)) {
    console.log(ERROR_MSG.GEOLOCATION_NOT_AVAILABLE);
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      setLocationCallback([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    },
    (error) => {
      if (onErrorCallback) onErrorCallback(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    }
  );

  return watchId;
};

export const stopWatchingPosition = (watchId: number | null) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};
