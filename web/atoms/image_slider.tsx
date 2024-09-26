import { useEffect, useState } from "react";
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

interface ImageSliderProps {
  files: File[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ files }) => {
  const [imageUrlList, setImageUrlList] = useState<string[] | null>(null);

  useEffect(() => {
    const urlList: string[] = [];

    for (const file of files) {
      urlList.push(URL.createObjectURL(file));
    }

    setImageUrlList(urlList);

    return () => {
      setImageUrlList([]);
    };
  }, [files]);

  return (
    <div className="w-full min-h-max">
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
        {imageUrlList?.map((val, key) => (
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
    </div>
  );
};
