import { LoginUserRes } from "@/interface/auth.dto";
import { User } from "@/interface/user";

/**
 * LoginUserRes -> User 로 변환
 * @param user LoginUserRes
 * @returns User
 */
export const convertUser = (user: LoginUserRes): User => {
  return {
    id: user._id.$oid,
    email: user.email,
    name: user.name,
  };
};
