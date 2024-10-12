export enum SEARCH_TYPE {
  TITLE = "title",
  USER = "user",
}

export interface SearchReq {
  search_type: SEARCH_TYPE,
  body: string
}