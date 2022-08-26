import * as cloudinary from "cloudinary";
const APIKEY = process.env.CLOUDINARY_APIKEY;
const APISECRET = process.env.CLOUDINARY_APISECRET;
cloudinary.v2.config({
    cloud_name: "dmycj7gmx",
    api_key: APIKEY,
    api_secret: APISECRET,
});

export { cloudinary };
