import multer from "multer";

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, ''); // Remove colons from timestamp
    const fileuploaded = `${timestamp}-${file.originalname}`;
        cb(null,fileuploaded);
  },
});

export const upload = multer({ storage: postStorage });
