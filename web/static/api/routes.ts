export enum API_ROUTE {

  // AUTH
  REGISTER = "/api/auth/register",
  LOGIN = "/api/auth/login",
  LOGOUT = "/api/auth/logout",
  ME = "/api/auth/me",
  REPUBLISH_REFRESH_TOKEN = "/api/auth/refresh",
  REPUBLISH_ACCESS_TOKEN = "/api/auth/refresh/access_token",

  // CONTENTS
  MAP_SAVE = "/api/contents/map_save",
  MAP_ME = "/api/contents/me",
  MAP_READ = "/api/contents/read",
  MAP_SEARCH = "/api/contents/search",

  // UPLOAD
  UPLOAD = "/api/upload",
  DELETE = "/api/delete"
}