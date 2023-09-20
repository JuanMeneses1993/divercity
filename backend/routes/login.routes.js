import { Router } from "express";
import { usersController } from "../controllers/users.controller";

const router = Router();

router.post("/", usersController.checkUserPass);
router.delete("/", usersController.logOut);

export default router;