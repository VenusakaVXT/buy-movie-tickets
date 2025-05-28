import React from "react"
import { Tooltip } from "react-tooltip"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import "../../scss/GoToTopButton.scss"

const ChatBoxButton = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div>
            <button
                className="go-to-top-btn"
                style={{ bottom: "20px" }}
                data-tooltip-content={t("chat.title")}
                data-tooltip-id="chatbox"
                onClick={() => navigate("/chat")}
                onMouseOver={e => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = "#e50914";
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#ff0000";
                }}
            >
                <SupportAgentIcon
                    fontSize="large"
                    style={{
                        position: "relative",
                        right: "7px",
                        bottom: "7px"
                    }}
                />
            </button>

            <Tooltip
                id="chatbox"
                place="top"
                effect="solid"
                style={{
                    background: "rgba(37, 37, 38, 0.95)",
                    borderRadius: "16px",
                    zIndex: "9999"
                }}
            />
        </div>
    )
}

export default ChatBoxButton