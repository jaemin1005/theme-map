import { ObjectId } from "./objectId";

export interface User {
  user_id: ObjectId;
  // Email
  email: string;
  // NickName
  name: string;
}
