import * as express from "express";
import * as path from "path";
import {
    createUser,
    getUser,
    updateUser,
    loginUser,
    authMiddleware,
    userExist,
} from "./controllers/user-controller";
import {
    createPet,
    getPets,
    getOnePet,
    updatePet,
    getPetsByLocation,
    deletePet,
} from "./controllers/pet-controller";
import { createReport } from "./controllers/reporter-controller";
import * as cors from "cors";
const app = express();
const PORT = 3000;
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//endpoints User

//crea un usuario
app.post("/user", async (req, res) => {
    if (req.body) {
        const user = await createUser(req.body);
        res.status(200).json({ message: "usuario creado", user });
    } else {
        res.status(400).json({ message: "no hay contenido en el body" });
    }
});

//inicia sesión
app.post("/user/token", async (req, res) => {
    const token = await loginUser(req.body.email, req.body.password);
    if (token) res.status(200).json(token);
    else res.status(400).json({ message: "email o contraseña incorrecto" });
});

//busca un usuario
app.get("/user", authMiddleware, async (req, res) => {
    const userFind = await getUser(req._isValid["user_id"]);
    if (userFind) res.status(200).json({ message: "usuario encontrado", userFind });
    else res.status(404).json({ message: "usuario NO encontrado" });
});

//actualiza info del usuario
app.put("/user", authMiddleware, async (req, res) => {
    if (req.body) {
        const userUpdated = await updateUser(req._isValid["user_id"], req.body);
        res.status(200).json({ message: "info actualizada", userUpdated });
    } else {
        res.status(400).json({ message: "body o params no encontrado" });
    }
});

//verifica si el email ya existe en la base de datos
app.get("/user/verify-email", async (req, res) => {
    const user = await userExist(req.query.email);
    if (user) res.status(200).json({ message: "email encontrado", status: true });
    else res.status(404).json({ message: "email no encontrado", status: false });
});

//endpoints Pet

//crea un reporte de mascota perdida
app.post("/pet", authMiddleware, async (req, res) => {
    if (req.body) {
        req.body.UserId = req._isValid["user_id"];
        const newPet = await createPet(req.body.dataUrl, req.body);
        res.status(200).json(newPet);
    } else res.status(400).json({ message: "reporte no creado" });
});

//busca las mascotas reportadas por un usuario
app.get("/pet", authMiddleware, async (req, res) => {
    const pets = await getPets(req._isValid["user_id"]);
    if (pets.length) res.status(200).json(pets);
    else res.status(404).json({ message: "ninguna mascota encontrada" });
});

//busca una mascota reportada
app.get("/pet/:petid", async (req, res) => {
    const pet = await getOnePet(req.params.petid);
    if (pet) res.status(200).json(pet);
    else res.status(404).json({ message: "ninguna mascota encontrada" });
});

//busca mascotas cerca de una ubicación
app.get("/pet/search/location", async (req, res) => {
    const { lat, lng } = req.query;
    const petsAroundLocation = await getPetsByLocation({ lat, lng });
    if (petsAroundLocation.length) res.status(200).json(petsAroundLocation);
    else res.status(404).json({ message: "ninguna mascota encontrada" });
});

//actualiza la info de la mascota
app.put("/pet/:petid", authMiddleware, async (req, res) => {
    if (req.body) {
        const petUpdated = await updatePet(req.params.petid, req.body);
        res.status(200).json(petUpdated);
    } else res.status(400).json({ message: "mascota no actualizada" });
});

//elimina una mascota reportada por el usuario
app.delete("/pet/:petid", authMiddleware, async (req, res) => {
    const petDeleted = await deletePet(req._isValid["user_id"], req.params.petid);
    if (petDeleted) res.status(200).json(petDeleted);
    else res.status(400).json({ message: "error mascota no borrada" });
});
//endpoints Report

//crea un reporte sobre información de una mascota
app.post("/report", async (req, res) => {
    const { userId, petId } = req.query;

    const newReport = await createReport(userId, petId, req.body);
    if (newReport) res.status(200).json(newReport);
    else res.status(400).json({ message: "error reporte no enviado" });
});

//sirve el frontend
const pathRef = path.join(__dirname, "..", "/build/index.html");

app.use(express.static("build"));
app.get("*", (req, res) => {
    res.sendFile(pathRef);
});

//inicializador de la API
app.listen(PORT, () => {
    console.log("aplicación escuchando en el puerto " + PORT);
});
