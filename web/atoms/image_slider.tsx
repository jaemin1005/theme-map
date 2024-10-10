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
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface ImageSliderProps {
  imageDatas: Array<File | string>;
  isRemove: boolean
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  imageDatas,
  isRemove,
}) => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    // url인지 file인지 구분하여 업데이트
    const urls = imageDatas.map((img) => {
      if (typeof img != "string") return fileToUrl(img);
      else return img;
    });

    setUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageDatas]);

  const deleteCb = (idx: number) => {
    setUrls((prev) => {
        const newArr = [...prev];
        newArr.slice(idx, 1);

        return newArr;
    })
  }

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
                className="object-cover aspect-square rounded-lg"
                src={val}
                fill={true}
              />
              {isRemove && (
                <IconButton
                  aria-label="delete"
                  size="large"
                  className="absolute top-0 right-0 hover:text-red-500"
                  onClick={() => {deleteCb(key)}}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};
