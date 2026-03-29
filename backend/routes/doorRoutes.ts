import { Router } from "express";
import { getDoors, unlockDoor } from "../controllers/doorController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", getDoors);
router.post("/unlock", auth, unlockDoor);

export default router;
