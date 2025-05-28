import axios from "axios"

export const getChatSessions = async () => {
    const res = await axios.get("/chat/session")
    return res.data.sessions
}

export const createChatSession = async (data) => {
    const res = await axios.post("/chat/session", data)
    return res.data.session
}

export const getMessages = async (sessionId) => {
    const res = await axios.get(`/chat/message/${sessionId}`)
    return res.data.messages
}

export const sendMessage = async (data) => {
    const res = await axios.post("/chat/message", data)
    return res.data.message
}

export const getFaqs = async () => {
    const res = await axios.get("/chat/faq")
    return res.data.faqs
}