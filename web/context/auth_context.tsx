"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

// 사용자 데이터 인터페이스 정의
interface User {
  id: string;
  name: string;
  email: string;
}

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

        // 액세스 토큰이 있는 경우 사용자 정보 가져오기
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
