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
import { ImageData } from "@/interface/content.dto";
import { useImageUrls } from "@/utils/use_image_url";

interface ImageSliderProps {
  imageDatas: ImageData[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ imageDatas }) => {
  const urls = useImageUrls(imageDatas);

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
