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
import { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { ImageSlider } from "@/atoms/image_slider";
import { validateImage } from "@/utils/validate_img";
import { compressAndConvertToWebP } from "@/utils/compression_img";
import { Mark } from "@/interface/content.dto";

interface WriteModalProps {
  open: boolean;
  onOpenChange: () => void;
  cbSaveBtn: (
    imageDatas: Array<File | string>,
    title: string,
    body: string
  ) => void;
  writeable: boolean;
  mark?: Mark;
}

export const WriteModal: React.FC<WriteModalProps> = ({
  open,
  onOpenChange,
  cbSaveBtn,
  writeable,
  mark,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Array<File | string>>([]);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mark) {
      setFiles(mark.urls);
      if (writeable && titleRef.current && bodyRef.current) {
        titleRef.current.value = mark.title;
        bodyRef.current.value = mark.body;
      }
    } else {
      if (titleRef.current && bodyRef.current) {
        titleRef.current.value = "";
        bodyRef.current.value = "";
      }
    }
  }, [open, writeable, mark]);

  // 도달창을 닫을 때, 리액트훅 초기화
  const handlerClose = () => {
    setFiles([]);
  };

  // 버튼 클릭했을 때, input DOM을 클릭하게 한다.
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 이미지 유효성 검사
      const filterArr = Array.from(files).filter((file) => validateImage(file));

      const promises = filterArr.map((file) => compressAndConvertToWebP(file));
      const fileArr = await Promise.all(promises);

      setFiles((prev) => [...prev, ...fileArr]);
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
                {writeable ? (
                  <MuiButton
                    variant="contained"
                    startIcon={<AddAPhotoIcon />}
                    className="w-fit"
                    onClick={handleButtonClick}
                  >
                    Add Photo
                  </MuiButton>
                ) : (
                  <h1 className="overflow-hidden">{mark?.title}</h1>
                )}
              </ModalHeader>
              <ModalBody>
                <ImageSlider
                  imageDatas={files}
                  isRemove={writeable}
                ></ImageSlider>
                {writeable ? (
                  <>
                    <TextField
                      inputRef={titleRef}
                      label="Title"
                      variant="outlined"
                    />
                    <TextField
                      inputRef={bodyRef}
                      label="Body"
                      multiline
                      rows={10}
                    />
                  </>
                ) : (
                  <p className="h-auto break-words">{mark?.body}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {writeable && <Button
                  color="primary"
                  onPress={() => {
                    if (titleRef.current && bodyRef.current) {
                      cbSaveBtn(
                        files,
                        titleRef.current?.value,
                        bodyRef.current?.value
                      );
                    }
                    onClose();
                  }}
                >
                  Save
                </Button>}
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
