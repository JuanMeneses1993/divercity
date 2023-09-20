import { Router } from "express";
import { historyController } from "../controllers/history.controller";
const router = Router();

router.get("/", historyController.getTvHistory);


export default router;
