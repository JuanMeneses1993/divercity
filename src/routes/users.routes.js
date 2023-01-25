import { Router } from "express";
import { usersController } from "../controllers/users.controller";

const router = Router();

router.get("/", usersController.getStatistics);//obtener todos los usuarios
router.post("/", usersController.createUser);//crear un usuario
router.delete("/", usersController.deleteUser);//Eliminar un usuario

export default router;


