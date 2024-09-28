const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export const validateImage = (file: File) => {
  return validImageTypes.includes(file.type);
};
