"use client";

import { ERROR_MSG } from "@/static/log/error_msg";
import { INIT_LOCATION_INFO } from "@/static/location";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import SideButtonComponent from "@/components/side/side_button_component";
import { WriteModal } from "@/components/modal/write_modal";
import { useMap } from "@/context/map_context";
import { SpeedDial } from "@/components/dial/speed_dial_component";
import { LoginModal } from "@/components/modal/login_modal";
import { LOGIN_MODAL } from "@/static/component/login_modal";
import { useAuth } from "@/context/auth_context";
import { useToast } from "@/components/toast/toast_hook";
import { ToastComponent } from "@/components/toast/toast_component";
import { isValidEmail } from "@/utils/validate";
import { TOAST_MSG } from "@/static/component/toast_msg";
import { RegisterModal } from "@/components/modal/register_modal";
import { RegisterReq } from "@/interface/auth.dto";
import { User } from "@/interface/user";
import { MarkerInfoModal } from "@/components/modal/marker_info_modal";
import { MapSaveModal } from "@/components/modal/map_save_modal";
import { MapReadReq, MapReadRes, MapSaveReq } from "@/interface/content.dto";
import { ObjectId } from "@/interface/objectId";
import { MapSearchMeModal } from "@/components/modal/map_search_me_modal";
import { UploadImageRes } from "@/interface/upload.dto";
import { ErrMsg } from "@/interface/err.dto";

// 클라이언트에서만 랜더링 되도록 설정한다.
const MapComponent = dynamic(() => import("../components/map_component"), {
  ssr: false,
});
const MarkerComponent = dynamic(
  () => import("../components/marker_component"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(
    INIT_LOCATION_INFO.COORDINATE
  );

  const [clickPosition, setClickPosition] = useState<[number, number] | null>(
    null
  );

  const [mark, setMark] = useState<boolean>(false);

  const { open, type, msg, time, setOpen, showToast } = useToast();

  useEffect(() => {
    // 현 위치 좌표가져오기
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error(ERROR_MSG.GEOLOCATION_PERMISSION_DENIED);
              break;
            case error.POSITION_UNAVAILABLE:
              console.error(ERROR_MSG.GEOLOCATION_POSITION_UNAVAILABLE);
              break;
            case error.TIMEOUT:
              console.error(ERROR_MSG.GEOLOCATION_TIMEOUT);
              break;
            default:
              console.error(ERROR_MSG.GEOLOCATION_GETTING_FAIL);
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      console.log(ERROR_MSG.GEOLOCATION_NOT_AVAILABLE);
    }
  }, []);

  //#region --modal 상태관리--

  // 글쓰기 모달
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  // 로그인 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 회원가입 모달
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // 마커정보 모달
  const [isMarkerInfoModalOpen, setIsMarkerModalOpen] = useState(false);
  // 맵 저장 모달
  const [isSaveMapModalOpen, setIsSaveMapModalOpen] = useState(false);
  // 자기 맵 검색 모달
  const [isMapSearchMeModalOpen, setIsMapSearchMeModalOpen] = useState(false);
  //#endregion

  //#region --context 관리--

  const {
    map,
    setMap,
    id,
    setId,
    marks,
    addMark,
    setMarks,
    setTitle,
    setBody,
    setIsEdited,
  } = useMap();

  const { setUser, logout, accessToken, setAccessToken } = useAuth();

  //#endregion

  //#region --Side Button Eventhandler--

  const clickMarkInfo = () => {
    if (marks.length === 0) showToast(TOAST_MSG.NO_MARKER_INFO, "warning");
    else {
      setIsMarkerModalOpen(true);
    }
  };

  const clickMapMe = () => {
    if (accessToken === null) showToast(TOAST_MSG.NEED_LOGIN, "warning");
    else {
      setIsMapSearchMeModalOpen(true);
    }
  };

  //#endregion

  //#region --이벤트 콜백 함수--

  const onMapReady = (map: L.Map) => {
    setMap(map);
  }

  const onMapClick = (event: L.LeafletMouseEvent) => {
    if (mark) {
      setClickPosition([event.latlng.lat, event.latlng.lng]);
      setIsWriteModalOpen(true);
    }
  };

  /**
   * Write Modal의 callback
   * Save Mark
   * @param imageDatas : 이미지에 대한 데이터,
   * @param title : 마커 제목
   * @param body : 마커 본문
   * @param editIndex : 수정 여부 및 인덱스
   * @returns
   */
  const saveMarkCb = async (
    imageDatas: Array<File | string>,
    title: string,
    body: string
  ) => {
    if (clickPosition === null) return;

    const formData = new FormData();
    const fileIndices: number[] = [];

    imageDatas.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`file${index}`, image);
        fileIndices.push(index);
      }
    });

    if (fileIndices.length === 0) {
      addMark({
        urls: imageDatas.filter((item) => typeof item === "string") as string[],
        title,
        body,
        point: clickPosition,
      });

      return;
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrMsg;
        showToast(errorData.message, "error");
        return;
      }

      const { img_urls: urls } = (await response.json()) as UploadImageRes;

      fileIndices.forEach((index) => {
        if (urls.length) {
          imageDatas[index] = urls.shift()!;
        }
      });

      addMark({
        urls: imageDatas.filter((item) => typeof item === "string"),
        title,
        body,
        point: clickPosition,
      });
    } catch {
      showToast(ERROR_MSG.INTERNAL_SERVER_ERROR, "error");
    }
  };

  // 로그인 모달 창 회원가입 버튼 클릭 이벤트 함수
  const registerBtnClick = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  /**
   * 로그인 함수
   * email과 password를 매개변수로 받아, 로그인을 한다.
   * @param email userid
   * @param password password
   */
  const loginFunc = async (email: string, password: string) => {
    if (isValidEmail(email) === false) {
      showToast(TOAST_MSG.INVALID_EMAIL, "error");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          user: User;
          accessToken: string;
        };
        // 유저 저장
        setUser(data.user);
        setAccessToken(data.accessToken);

        showToast(TOAST_MSG.LOGIN_SUCCESS + `${data.user.name}`, "success");
        setIsLoginModalOpen(false);
      } else {
        showToast(TOAST_MSG.LOGIN_FAIL, "error");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      showToast(TOAST_MSG.LOGIN_ERROR, "error");
    }
  };

  const registerFunc = async (
    email: string,
    name: string,
    password: string
  ) => {
    const registerReq: RegisterReq = {
      email,
      name,
      password,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerReq),
      });

      if (response.ok) {
        showToast(TOAST_MSG.REGISTER_SUCCESS, "success");
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
      } else {
        showToast(TOAST_MSG.REGISTER_FAIL, "error");
      }
    } catch (error) {}
  };

  const clickSaveMapBtn = async (title: string, body: string) => {
    const mapSaveReq: MapSaveReq = {
      _id: id,
      title,
      body,
      marks,
    };

    try {
      const response = await fetch("/api/contents/map_save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(mapSaveReq),
      });

      if (response.ok) {
        showToast(TOAST_MSG.MAP_SAVE_SUCCESS, "success");
        const data = (await response.json()) as ObjectId;
        setId(data);
        setIsSaveMapModalOpen(false);
      } else {
        showToast(TOAST_MSG.MAP_SAVE_FAIL, "error");
      }
    } catch (error) {
      showToast(TOAST_MSG.MAP_SAVE_ERROR, "error");
    }
  };

  const readMap = async (_id: ObjectId) => {
    const body: MapReadReq = {
      _id,
    };

    const res = await fetch("api/contents/read", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const mapReadRes = (await res.json()) as MapReadRes;
      const map = mapReadRes.map;

      if (map._id) setId(map._id);

      setTitle(map.title);
      setBody(map.body);
      setMarks(map.marks);
      setIsEdited(mapReadRes.is_edit);

      return true;
    } else {
      showToast(TOAST_MSG.MAP_READ_FAIL, "error");
      return false;
    }
  };

  //#endregion

  return (
    <div className="w-screen h-screen relative">
      <MapComponent
        center={currentLocation}
        zoom={INIT_LOCATION_INFO.ZOOM}
        onMapReady={onMapReady}
        onMapClick={onMapClick}
      >
        <MarkerComponent></MarkerComponent>
      </MapComponent>
      <SideButtonComponent
        map={map}
        toggleMark={[
          mark,
          () => {
            setMark((prev) => !prev);
          },
        ]}
        clickMarkInfo={clickMarkInfo}
        clickMapMe={clickMapMe}
      />
      <WriteModal
        open={isWriteModalOpen}
        onOpenChange={() => {
          setIsWriteModalOpen((prev) => !prev);
        }}
        cbSaveBtn={saveMarkCb}
        writeable={true}
      />
      <LoginModal
        title={LOGIN_MODAL.TITLE}
        forgetPasswordMsg={LOGIN_MODAL.FORGET_PASSWORD_MSG}
        handleForgetPassword={() => {}}
        loginMsg={LOGIN_MODAL.LOGIN_BUTTON_MSG}
        handleLogin={loginFunc}
        open={isLoginModalOpen}
        onOpenChange={() => {
          setIsLoginModalOpen((prev) => !prev);
        }}
        handleRegisterClick={registerBtnClick}
      ></LoginModal>
      <RegisterModal
        open={isRegisterModalOpen}
        onOpenChange={() => {
          setIsRegisterModalOpen((prev) => !prev);
        }}
        registerCbFunc={registerFunc}
      ></RegisterModal>
      <MarkerInfoModal
        open={isMarkerInfoModalOpen}
        onOpenChange={() => {
          setIsMarkerModalOpen((prev) => !prev);
        }}
      ></MarkerInfoModal>
      <MapSaveModal
        open={isSaveMapModalOpen}
        onOpenChange={() => {
          setIsSaveMapModalOpen((prev) => !prev);
        }}
        clickSaveCb={clickSaveMapBtn}
      ></MapSaveModal>
      <MapSearchMeModal
        isOpen={isMapSearchMeModalOpen}
        onOpenChange={() => {
          setIsMapSearchMeModalOpen((prev) => !prev);
        }}
        accessToken={accessToken}
        onClickComponentCb={readMap}
      ></MapSearchMeModal>
      <SpeedDial
        onLoginClick={() => {
          setIsLoginModalOpen(true);
        }}
        onRegisterClick={() => {
          setIsRegisterModalOpen(true);
        }}
        onLogoutClick={logout}
        onProfileClick={() => {}}
        onSaveClick={() => {
          setIsSaveMapModalOpen(true);
        }}
      />
      <ToastComponent
        open={open}
        setOpen={setOpen}
        type={type}
        time={time}
        msg={msg}
      />
    </div>
  );
}
