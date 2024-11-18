import { MapSearchMeRes } from "@/interface/content.dto";
import { API_ROUTE } from "@/static/api/routes";

export type MeSelect = "me" | "like";

export const meFetch = async (
  curSelect: MeSelect,
  accessToken: string
): Promise<MapSearchMeRes[]> => {
  const url = curSelectToUrl(curSelect);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await res.json();
};

const curSelectToUrl = (curSelect: MeSelect) => {
  switch (curSelect) {
    case "me":
      return API_ROUTE.MAP_ME;
    case "like":
      return API_ROUTE.MAP_ME_LIKE;
  }
};
