"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

import {User} from "@/interface/user"
import { AccessTokenRes } from "@/interface/auth.dto";
import { ErrMsg } from "@/interface/err.dto";


// 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => void;
  accessToken: string | null
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!accessToken) {
          // 액세스 토큰이 없으면 리프레시 토큰으로 새로고침
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
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
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/refresh/access_token", {
          method: "GET",
          credentials: "include",
        });


        if (response.ok) {
          const refreshData = await response.json() as AccessTokenRes
          setAccessToken(refreshData.access_token);
    
        } else {
          const refreshData = await response.json() as ErrMsg
          console.error(refreshData.message);
          setUser(null);
        }
      } catch (error) {
        console.error("토큰 갱신 중 오류 발생:", error);
        setUser(null);
      }
    }, 10 * 60 * 1000); // 10분 (10 * 60 * 1000 ms)

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [accessToken]);

  // 로그아웃 함수
  const logout = async () => {
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
