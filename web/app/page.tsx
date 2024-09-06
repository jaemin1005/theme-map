'use client'

import dynamic from "next/dynamic";

// 클라이언트에서만 랜더링 되도록 설정한다.
const MapComponent = dynamic(() => import("../components/map_component"), { ssr: false });


export default function Home() {
  return <MapComponent center={[128,128]} zoom={18}></MapComponent>;
}
