/**
 * Upload file to Google Cloud Storage
 */

const getFile = require("./file");

console.log(getFile.filename);

const bucketName = "web-construtora-cp-bucket";
const filename = "../images/carregar-1592486549323.png";

const { Storage } = require("@google-cloud/storage");
const file = require("./file");

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
