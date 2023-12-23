import React, { useState, useEffect } from "react"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { Tooltip } from "react-tooltip"
import "../../scss/GoToTopButton.scss"

const GoToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false)

    const handleScroll = () => { setIsVisible(window.scrollY > 100) }

    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }) }

    useEffect(() => {
        // Subscribe for the scroll event when the component is mounted
        window.addEventListener("scroll", handleScroll)

        // Unsubscribe event when component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div>
            {isVisible && (
                <button
                    className="go-to-top-btn bottom-up-animation"
                    data-tooltip-content="Go To Top"
                    data-tooltip-id="gtt"
                    onClick={() => {
                        scrollToTop()
                        document.querySelector(".go-to-top-btn").classList.add("go-down-animation")
                    }}
                >
                    <KeyboardArrowUpIcon fontSize="large" style={{
                        position: "relative",
                        right: "7px",
                        bottom: "7px"
                    }} />
                </button>
            )}

            <Tooltip
                id="gtt"
                place="top"
                effect="solid"
                style={{
                    background: "rgba(37, 37, 38, 0.95)",
                    borderRadius: "16px"
                }}
            />
        </div>
    )
}

export default GoToTopButton