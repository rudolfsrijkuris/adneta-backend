// imageUpload.js (Backend)

import express from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import jwt from "jsonwebtoken";
import Project from "./projectModel.js";
import sharp from "sharp";

const router = express.Router();
const storage = new Storage({ keyFilename: './gcloud-storage-api-key.json' });
const bucketName = 'adneta';
const jwtSecret = 'ADNETA-CRAZY-RANDOM-TOKEN'; // Move to a config file

// Set up multer for handling file uploads
const storageConfig = multer.memoryStorage();
const upload = multer({ storage: storageConfig });

// Custom error handling middleware
const handleErrors = (res, error, status = 500) => {
  console.error('Error:', error);
  res.status(status).send('Error uploading the file.');
};

// Image compression middleware
const compressImage = async (fileBuffer) => {
  try {
    return await sharp(fileBuffer)
      .resize(100)
      .toBuffer();
  } catch (error) {
    throw error;
  }
};

// Function for verifying JWT token
const verifyToken = (jwtToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, jwtSecret, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
};

// Function for uploading a file to Google Cloud Storage
const uploadFileToStorage = (bucket, filename, fileBuffer, contentType) => {
  return new Promise((resolve, reject) => {
    const fileOptions = {
      metadata: {
        contentType,
      },
    };
    const fileStream = bucket.file(filename).createWriteStream(fileOptions);

    fileStream.on('error', (err) => reject(err));
    fileStream.on('finish', () => resolve());
    fileStream.end(fileBuffer);
  });
};

// Function for saving project data to the database
const saveProjectToDatabase = (category, country, name, aboutProject, imageUrl) => {
  return new Project({
    category,
    country,
    name,
    aboutProject,
    imageUrl,
  }).save();
};

router.post("/imageUpload", upload.single('profileImage'), async (req, res) => {
  try {
    const { project_Name, country, category, aboutProject } = req.body;
    const file = req.file;

    if (!file || !project_Name || !country || !category || !aboutProject) {
      return res.status(400).send('All fields are required.');
    }

    const originalname = file.originalname;
    const fileExtension = originalname.split('.').pop();
    const filename = `project-images/${Date.now()}.${fileExtension}`;
    const bucket = storage.bucket(bucketName);
    const fileContentType = file.mimetype;

    const authHeader = req.headers.authorization;
    const tokenParts = authHeader.split(' ');

    if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
      const jwtToken = tokenParts[1];

      try {
        const decodedToken = await verifyToken(jwtToken);
        const userId = decodedToken.userId;
        const compressedBuffer = await compressImage(file.buffer);

        await Promise.all([
          uploadFileToStorage(bucket, filename, file.buffer, fileContentType),
          uploadFileToStorage(bucket, filename, compressedBuffer, fileContentType),
        ]);

        const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        await saveProjectToDatabase(category, country, project_Name, aboutProject, imageUrl);

        res.status(200).send('File uploaded successfully.');
      } catch (error) {
        handleErrors(res, error, 401);
      }
    } else {
      res.status(401).send('Unauthorized: Invalid token format');
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

export default router;
