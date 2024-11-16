import { ObjectId } from "@/interface/objectId";

export const likeFetch = async (
  mapId: string,
  accessToken: string
): Promise<Array<ObjectId>> => {
  const res = await fetch(`/api/maps/${mapId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const objectids = await res.json();

  return objectids;
};

export const dislikeFetch = async (
  mapId: string,
  accessToken: string
): Promise<Array<ObjectId>> => {
  const res = await fetch(`/api/maps/${mapId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const objectids = await res.json();

  return objectids;
};
