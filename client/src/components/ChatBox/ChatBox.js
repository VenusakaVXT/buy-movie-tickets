import React, { useEffect, useState, useRef } from "react"
import { Box, Typography, TextField, Button, List, ListItem, Avatar, Divider } from "@mui/material"
import { getChatSessions, createChatSession, getMessages, sendMessage, getFaqs } from "../../api/chatApi"
import SendIcon from "@mui/icons-material/Send"
import { socket } from "../../App"
import { useTranslation } from "react-i18next"
import "../../scss/ChatBox.scss"

const ChatBox = ({ userId, userType }) => {
    const [sessions, setSessions] = useState([])
    const [selectedSession, setSelectedSession] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [faqs, setFaqs] = useState([])
    const messagesEndRef = useRef(null)
    const { t } = useTranslation()

    useEffect(() => {
        getChatSessions().then(setSessions)
        getFaqs().then(setFaqs)
    }, [])

    useEffect(() => {
        if (selectedSession) {
            getMessages(selectedSession._id).then(setMessages)
            socket.emit("joinSession", selectedSession._id)
        }
    }, [selectedSession])

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            if (msg.sessionId === selectedSession?._id) {
                setMessages((prev) => [...prev, msg])
            }
        })
        return () => socket.off("receiveMessage")
    }, [selectedSession])

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // }, [messages])

    const handleNewSession = async () => {
        const session = await createChatSession({ customer: userId })
        setSessions((prev) => [...prev, session])
        setSelectedSession(session)
    }

    const handleSend = async () => {
        if (!input.trim() || !selectedSession) return
        const msg = {
            sessionId: selectedSession._id,
            sender: userType,
            senderId: userId,
            content: input
        }
        socket.emit("sendMessage", { ...msg, sessionId: selectedSession._id })
        await sendMessage(msg)
        setInput("")
    }

    const handleSendFaq = (faq) => {
        setInput(faq.question)
        setTimeout(() => {
            handleSend()
            setTimeout(() => {
                setMessages((prev) => [...prev, {
                    sender: "manager",
                    content: faq.answer,
                    createdAt: new Date()
                }])
            }, 300)
        }, 100)
    }

    return (
        <Box className="chatbox__container">
            <Box className="chatbox__sidebar">
                <Typography variant="h6" color="#fff" mb={2}>{t("chat.title")}</Typography>
                <Button className="chatbox__btn" sx={{ width: "100%", mb: 2 }} onClick={handleNewSession}>
                    + {t("chat.newChat")}
                </Button>
                <List className="chatbox__session-list">
                    {sessions.map((session) => (
                        <ListItem
                            key={session._id}
                            selected={selectedSession?._id === session._id}
                            onClick={() => setSelectedSession(session)}
                            className="chatbox__session-item"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#e50914" }} />
                            <Box ml={1}>
                                <Typography color="#fff" fontSize={14}>
                                    {session.manager ? t("chat.supportStaff") : t("chat.noConnection")}
                                </Typography>
                                <Typography color="#ccc" fontSize={12}>
                                    {new Date(session.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box className="chatbox__main">
                <Box className="chatbox__header">
                    <Typography color="#fff" fontWeight={600}>
                        {selectedSession ? t("chat.customerSupport") : t("chat.selectOrCreateChat")}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: "#444" }} />
                <Box className="chatbox__messages">
                    {selectedSession ? (
                        <>
                            {messages.map((msg, idx) => (
                                <Box
                                    key={idx}
                                    className={`chatbox__msg ${msg.sender === userType ? "chatbox__msg--me" : "chatbox__msg--other"}`}
                                >
                                    <Box className="chatbox__msg-content">{msg.content}</Box>
                                    <Typography className="chatbox__msg-time">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                                    </Typography>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <Typography color="#ccc" mt={2}>{t("chat.selectChatToStart")}</Typography>
                    )}
                </Box>
                {selectedSession && faqs.length > 0 && (
                    <Box className="chatbox__faq">
                        <Typography color="#fff" fontSize={14} mb={1}>{t("chat.question")}:</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {faqs.map((faq, idx) => (
                                <Button
                                    key={idx}
                                    className="chatbox__faq-btn"
                                    sx={{ bgcolor: "#2f3032", color: "#fff", border: "1px solid #e50914" }}
                                    onClick={() => handleSendFaq(faq)}
                                >
                                    {faq.question}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                )}
                <Box className="chatbox__input">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={t("chat.placeholder")}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        sx={{ bgcolor: "#2f3032", input: { color: "#fff" } }}
                    />
                    <Button className="chatbox__btn" sx={{ ml: 1 }} onClick={handleSend}>
                        <SendIcon />
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ChatBox