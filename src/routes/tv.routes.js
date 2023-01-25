import { Router } from "express";
import { tvController } from "./../controllers/tv.controller";

const router = Router();

router.post("/", tvController.activateTv);
router.get("/", tvController.getTvsInfo);
router.delete("/:tvNumber", tvController.deactivateTv);

export default router;


