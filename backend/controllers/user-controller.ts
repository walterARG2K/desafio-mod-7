import { User, Auth } from "../models";
import { getSHA256 } from "../libs/encrypt";
import * as jwt from "jsonwebtoken";
const SECRET = process.env.SECRET_TOKEN_JWT;

export function authMiddleware(req, res, next) {
    const authorization = req.get("Authorization")?.split(" ")[1];
    try {
        req._isValid = jwt.verify(authorization, SECRET);
        next();
    } catch (error) {
        res.status(401).json({
            error: "headers authorization has not found or token is invalid!",
        });
    }
}

export async function createUser(userInfo) {
    const { full_name, email, password } = userInfo;
    //create or find user in database
    const [user] = await User.findOrCreate({
        where: { email },
        defaults: {
            full_name,
            email,
        },
    });

    //get userid and find or create auth dates
    const [auth] = await Auth.findOrCreate({
        where: { user_id: user.get("id") },
        defaults: {
            email,
            password: getSHA256(password),
        },
    });

    return { user, auth };
}

export async function getUser(userId) {
    const user = await User.findByPk(userId);
    return user;
}

export async function updateUser(userId, updateInfo) {
    const userUpdated = await User.update(updateInfo, {
        where: {
            id: userId,
        },
    });
    const data = {};
    if (updateInfo.password) data["password"] = getSHA256(updateInfo.password);
    if (updateInfo.email) data["email"] = updateInfo.email;
    const AuthUpdated = await Auth.update(data, {
        where: {
            user_id: userId,
        },
    });
    return userUpdated;
}

export async function loginUser(email, password) {
    const findUser = await Auth.findOne({
        where: {
            email,
            password: getSHA256(password),
        },
    });

    if (findUser) return jwt.sign({ user_id: findUser.get("user_id") }, SECRET);
}

export async function userExist(email) {
    const findUser = await User.findOne({
        where: {
            email,
        },
    });
    return findUser;
}
