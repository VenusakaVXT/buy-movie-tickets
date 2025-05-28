import ChatSession from "../models/ChatSession.js"
import Message from "../models/Message.js"
import FaqTemplate from "../models/FaqTemplate.js"

class ChatController {
    getSessions = async (req, res) => {
        try {
            const sessions = await ChatSession.find()
            res.status(200).json({ sessions })
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch sessions", error: err.message })
        }
    }

    createSession = async (req, res) => {
        try {
            const session = new ChatSession(req.body)
            await session.save()
            res.status(201).json({ session })
        } catch (err) {
            res.status(500).json({ message: "Failed to create session", error: err.message })
        }
    }

    getMessages = async (req, res) => {
        try {
            const messages = await Message.find({ session: req.params.sessionId })
            res.status(200).json({ messages })
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch messages", error: err.message })
        }
    }

    sendMessage = async (req, res) => {
        try {
            const message = new Message(req.body)
            await message.save()
            res.status(201).json({ message })
        } catch (err) {
            res.status(500).json({ message: "Failed to send message", error: err.message })
        }
    }

    getFaqs = async (req, res) => {
        try {
            const faqs = await FaqTemplate.find()
            res.status(200).json({ faqs })
        } catch (err) {
            res.status(500).json({ message: "Failed to fetch FAQs", error: err.message })
        }
    }
}

export default new ChatController