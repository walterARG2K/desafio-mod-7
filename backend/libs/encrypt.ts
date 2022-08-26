import * as crypto from "crypto";
export function getSHA256(pass) {
    if (pass) return crypto.createHash("sha256").update(pass).digest("hex");
    else return undefined;
}
