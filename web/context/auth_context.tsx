"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

import { User } from "@/interface/user";
import { AccessTokenRes } from "@/interface/auth.dto";
import { ErrMsg } from "@/interface/err.dto";
import { getDeviceId } from "@/utils/getDeviceId";
import { jwtDecode } from "jwt-decode";
import { Claims } from "@/interface/claims.dto";

// 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 리프레시 토큰을 통해 자동 로그인
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const deviceId = getDeviceId();
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Device-ID": deviceId,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAccessToken(refreshData.accessToken);
          setUser(refreshData.user);
        } else {
          console.error("리프레시 토큰이 유효하지 않습니다.");
          setUser(null);
        }
        setLoading(false);
        return;
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const refreshAccessToken = async () => {
      const deviceId = getDeviceId();

      try {
        const response = await fetch("/api/auth/refresh/access_token", {
          method: "GET",
          credentials: "include",
          headers: {
            "Device-ID": deviceId,
          },
        });

        if (response.ok) {
          const refreshData = (await response.json()) as AccessTokenRes;
          setAccessToken(refreshData.access_token);
        } else {
          const refreshData = (await response.json()) as ErrMsg;
          console.error(refreshData.message);
          setUser(null);
        }
      } catch (error) {
        console.error("토큰 갱신 중 오류 발생:", error);
        setUser(null);
      }
    }; // 10분 (10 * 60 * 1000 ms)

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken) as Claims;

      // 만료 5분전에 요청한다.
      // access_token 만료시간 15분
      const refreshTime =
        decodedToken.exp - Math.floor(Date.now() / 1000) - 600;

      const timeout = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime * 1000);

      return () => clearTimeout(timeout);
    } else {
      fetchUser();
    }
  }, [accessToken]);

  // Access Token 재발급 받는 로직
  // 만료되기 5분전에 setTimeout을 통해 재발급 받는다.
  useEffect(() => {
    const refreshAccessToken = async () => {
      const deviceId = getDeviceId();

      try {
        const response = await fetch("/api/auth/refresh/access_token", {
          method: "GET",
          credentials: "include",
          headers: {
            "Device-ID": deviceId,
          },
        });

        if (response.ok) {
          const refreshData = (await response.json()) as AccessTokenRes;
          setAccessToken(refreshData.access_token);
        } else {
          const refreshData = (await response.json()) as ErrMsg;
          console.error(refreshData.message);
          setUser(null);
        }
      } catch (error) {
        console.error("토큰 갱신 중 오류 발생:", error);
        setUser(null);
      }
    }; // 10분 (10 * 60 * 1000 ms)

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken) as Claims;

      // 만료 5분전에 요청한다.
      // access_token 만료시간 15분
      const refreshTime =
        decodedToken.exp - Math.floor(Date.now() / 1000) - 600;

      const timeout = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime * 1000);

      return () => clearTimeout(timeout);
    }
  }, [accessToken]);

  // 로그아웃 함수
  const logout = async (): Promise<void> => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, logout, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
