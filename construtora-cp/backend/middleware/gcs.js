/**
 * Upload file to Google Cloud Storage
 */
const path = require("path");
const getFile = require("./file");
const { Storage } = require("@google-cloud/storage");
require('dotenv').config();

//console.log(getFile.filename);

const bucketName = process.env.GCLOUD_APP_BUCKET_NAME
console.log(bucketName);
//GCLOUD_PROJECT_ID="${GCLOUD_PROJECT_ID}"
const filename = "backend/images/a.png";

const gcStorage = new Storage();

async function uploadImages() {
    await gcStorage.bucket(bucketName).upload(filename, {
        metada: {
            cacheControl: 'public, max-age=31536000',
        },
    });
    console.log(`${filename} uploaded to ${bucketName}.`);
}

uploadImages().catch(console.error);
