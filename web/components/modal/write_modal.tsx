"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Button as MuiButton } from "@mui/material";
import { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { ImageSlider } from "@/atoms/image_slider";
import { validateImage } from "@/utils/validate_img";
import { compressAndConvertToWebP } from "@/utils/compression_img";

interface WriteModalProps {
  open: boolean;
  onOpenChange: () => void;
  cbSaveBtn: (file: Blob[], title: string, body: string) => void;
}

export const WriteModal: React.FC<WriteModalProps> = ({
  open,
  onOpenChange,
  cbSaveBtn,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [blobs, setBlobs] = useState<Blob[]>([]);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLInputElement | null>(null);

  // 도달창을 닫을 때, 리액트훅 초기화
  const handlerClose = () => {
    setBlobs([]);
  };

  // 버튼 클릭했을 때, input DOM을 클릭하게 한다.
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 이미지 유효성 검사
      const filterArr = Array.from(files).filter((file) => validateImage(file));

      const promises = filterArr.map((file) => compressAndConvertToWebP(file));
      const blobArr = await Promise.all(promises);

      setBlobs((prev) => [...prev, ...blobArr] )
    }
  };

  return (
    <div>
      <Modal
        backdrop="opaque"
        isOpen={open}
        placement="center"
        onOpenChange={onOpenChange}
        onClose={handlerClose}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <MuiButton
                  variant="contained"
                  startIcon={<AddAPhotoIcon />}
                  className="w-fit"
                  onClick={handleButtonClick}
                >
                  Add Photo
                </MuiButton>
              </ModalHeader>
              <ModalBody>
                <ImageSlider blobs={blobs}></ImageSlider>
                <TextField inputRef={titleRef} label="Title" variant="outlined" />
                <TextField inputRef={bodyRef} label="Body" multiline rows={10} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (titleRef.current && bodyRef.current) {
                      cbSaveBtn(
                        blobs,
                        titleRef.current?.value,
                        bodyRef.current?.value
                      );
                    }
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
