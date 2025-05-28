import express from "express"
import ChatController from "../controllers/chatController.js"

const router = express.Router()

router.get("/session", ChatController.getSessions)
router.post("/session", ChatController.createSession)
router.get("/message/:sessionId", ChatController.getMessages)
router.post("/message", ChatController.sendMessage)
router.get("/faq", ChatController.getFaqs)

export default router