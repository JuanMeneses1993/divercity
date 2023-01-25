import { Router } from "express";
import { methods as languageController } from "./../controllers/language.controller";
import { methods as clienteController } from "./../controllers/cliente.controller";

const router = Router();

router.get("/", clienteController.getClientes);
router.get("/:id", languageController.getLanguage);
router.post("/", languageController.addLanguage);
router.put("/:id", languageController.updateLanguage);
router.delete("/:id", languageController.deleteLanguage);

export default router;
