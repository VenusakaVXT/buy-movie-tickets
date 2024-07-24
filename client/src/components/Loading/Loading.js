import React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"
import "../../scss/App.scss"

const Loading = () => {
    const { t } = useTranslation()

    return (
        <Box
            height={"100vh"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
        >
            <Box className="loading-spinner" margin={"0 auto"}></Box>
            <Typography margin={"10px 0 0 10px"} color={"#e5e5e5"}>
                {t("loading").toUpperCase()}...
            </Typography>
        </Box>
    )
}

export default Loading