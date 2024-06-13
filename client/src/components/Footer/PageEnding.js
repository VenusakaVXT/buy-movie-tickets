import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import CopyrightIcon from "@mui/icons-material/Copyright"
import CircleIcon from "@mui/icons-material/Circle"
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg"
import "../../scss/PageEnding.scss"

const PageEnding = () => {
    const [systemStatus, setSystemStatus] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/movie`)
                setSystemStatus(response.status)
            } catch (err) {
                console.error("Error fetching data:", err)
            }
        }

        fetchData()
    }, [])

    return (
        <Box
            width={"100%"}
            height={"170px"}
            sx={{ bgcolor: "#000", borderTop: "0.5px solid #ff0000" }}
        >
            <Box
                className="page-ending"
                margin={5}
                color={"#fff"}
                fontSize="12px"
                lineHeight="16px"
            >
                <Box
                    padding={"0 160px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <span className="no-hovering">External links:</span>
                    <span>Wikipedia</span>
                    <span>Google</span>
                    <span>Youtube</span>
                    <span>Bank</span>
                    <span>E-wallet</span>
                    <span>CH Play</span>
                    <span>App Store</span>
                </Box>

                <Box
                    margin={"0 24px 0 30px"}
                    padding={2}
                    display={"flex"}
                    justifyContent={"space-between"}
                >
                    <span className="no-hovering">
                        System Status: {systemStatus}
                        <CircleIcon
                            fontSize="10px"
                            htmlColor={
                                systemStatus === 200 ? "#20be22" : "#ff0000"
                            }
                            style={{
                                borderRadius: "50%",
                                boxShadow: "0 0 10px rgba(52, 152, 219, 0.8)",
                            }}
                        />
                    </span>
                    <span>Introduction</span>
                    <span>Policy</span>
                    <span>Security</span>
                    <span>Teams</span>
                    <span>Cinemas</span>
                    <span>Tutorial</span>
                    <span>Chatbots</span>
                    <span>
                        24/7 Customer care
                        <PermPhoneMsgIcon fontSize="10px" />
                    </span>
                </Box>

                <Box paddingTop={2} borderTop={"1px solid #fff"}>
                    <p>
                        <CopyrightIcon fontSize="10px" />
                        {new Date().getFullYear()} BMT, Venus Inc.
                    </p>
                </Box>
            </Box>
        </Box>
    )
}

export default PageEnding