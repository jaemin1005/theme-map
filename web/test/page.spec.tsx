// 테스트를 위해 any 허용
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/page";
import { ERROR_MSG } from "@/static/error_msg";

// Mock the dynamic import
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => <div>MapComponent</div>;
  DynamicComponent.displayName = "MapComponent";
  return DynamicComponent;
});

// LoadingComponent 모킹
jest.mock("@/components/loading_component", () => {
  const LoadingComponent = () => <div>Loading...</div>;
  LoadingComponent.displayName = "LoadingComponent";
  return LoadingComponent;
});

describe("Home component", () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
  };

  beforeEach(() => {
    // geolocaiton 모킹
    (global.navigator as any).geolocation = mockGeolocation;
  });

  it("로딩 컴포넌트가 제대로 작동 되는지 확인한다.", () => {
    // getCurrentPosition 모킹, loading == true 상태
    mockGeolocation.getCurrentPosition.mockImplementation(() => {});

    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("성공적으로 좌표를 받았을 때 MapComponent가 호출되는지 확인한다.", async () => {
    
    // 콜백 함수를 받아서 함수를 실행하도록 모킹
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 37.5665,
          longitude: 126.978,
        },
      });
    });

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText("MapComponent")).toBeInTheDocument();
  });

  it("좌표받는 도중 의문의 이유로 에러를 호출당할 때, 로딩창이 꺼지는지 확인", async () => {
    // console.error Spy 
    // mockImplementation으로 console 출력을 방지한다.
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // 에러를 호출한다.
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error("Geolocation error"));
    });

    await act(async () => {
      render(<Home />);
    });

    // 조건문 분기가 예상가 맞는지 확인.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      ERROR_MSG.GEOLOCATION_GETTING_FAIL,
      expect.any(Error)
    );

    // 로딩이 끝나고 MapComponent를 호출하는지 확인한다.
    expect(screen.getByText("MapComponent")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("브라우저가 geolocation을 지원하지 않을 때", async () => {

    // console.log를 Spy
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    // 테스트를 위해 geolocation을 delete 한다 
    delete (global.navigator as any).geolocation;

    await act(async () => {
      render(<Home />);
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      ERROR_MSG.GEOLOCATION_NOT_AVAILABLE
    );
    
    expect(screen.getByText("MapComponent")).toBeInTheDocument();

    consoleLogSpy.mockRestore();
  });
});
