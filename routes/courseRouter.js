const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads
const {
    uploadSingleFile,
    uploadMultipleFile,
    getFile,
    ListAllFiles,
    deleteFile,
    deleteEntireFolder,
    createNewCourse,
} = require("./../controllers/courseController"); // Importing controller functions for handling requests

// Routes for creating courses
router.route("/upload-single").post(
    upload.single("file"), // Middleware for processing single file uploads
    uploadSingleFile // Controller function for handling single file upload
);
router.route("/upload-multiple").post(
    upload.array("file", 50), // Middleware for processing multiple file uploads (up to 50 files)
    uploadMultipleFile // Controller function for handling multiple file uploads
);
router.route("/createCourse").post(
    upload.array("file", 50), // Middleware for processing multiple file uploads (up to 50 files)
    createNewCourse // Controller function for creating a new course
);

// Routes for getting courses
router.route("/get-file").get(getFile); // Controller function for getting a file by filename
router.route("/listallfile").get(ListAllFiles); // Controller function for getting a list of all files in the bucket

// Routes for deleting courses
router.route("/deletefile").post(deleteFile); // Controller function for deleting a file by filename
router.route("/deleteFolder").post(deleteEntireFolder); // Controller function for deleting an entire folder and its contents

module.exports = router;
