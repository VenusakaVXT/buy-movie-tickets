import React from "react"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@mui/material"
import MovieIcon from "@mui/icons-material/Movie"

const Brand = () => {
    const { t } = useTranslation()

    return (
        <Box textAlign={"center"} padding={"70px 0"}>
            <MovieIcon sx={{ fontSize: "10rem" }} htmlColor="#e50914" />
            <Typography fontSize="2rem" color="#e50914">Buy Movie Tickets</Typography>
            <Typography fontSize="16px" color={"#fff"} mt={"5px"}>{t("brand")}</Typography>
        </Box>
    )
}

export default Brand