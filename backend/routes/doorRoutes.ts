import { Router } from "express";
import { getDoors, unlockDoor } from "../controllers/doorController";

const router = Router();

router.get("/", getDoors);
router.post("/unlock", unlockDoor);

export default router;
