import express from "express";
import {createShortUrl, deleteShortUrl} from "../controller/short_url.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/",createShortUrl);
router.delete("/:id",authMiddleware,deleteShortUrl);
export default router;
