import * as sgMail from "@sendgrid/mail";
const API_KEY = process.env.SENDGRID_APIKEY;
sgMail.setApiKey(API_KEY);

export async function sendgrid(msg) {
    return await sgMail.send(msg);
}
