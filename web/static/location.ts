//TODO IP를 통해 초기 좌표를 가져오는 로직이 필요하다.
//기본 좌표 정적 객체
export const INIT_LOCATION_INFO: Readonly<{
  COORDINATE: [number, number];
  ZOOM: number;
}> = {
  COORDINATE: [37.7749, -122.4194],
  ZOOM: 18,
};
