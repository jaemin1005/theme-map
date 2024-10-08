import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fileToUrl } from "@/utils/file_to_url";

interface ImageSliderProps {
  imageDatas: File[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ imageDatas }) => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = imageDatas.map((img) => fileToUrl(img))
    setUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [imageDatas]);

  return (
    <div className="w-full min-h-max">
      {urls.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
          spaceBetween={-10}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={true}
          effect="coverflow"
          centerInsufficientSlides={true}
        >
          {urls?.map((val, key) => (
            <SwiperSlide key={key} className="w-full relative aspect-square">
              <Image
                alt="slider"
                className="object-cover aspect-square"
                src={val}
                fill={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
