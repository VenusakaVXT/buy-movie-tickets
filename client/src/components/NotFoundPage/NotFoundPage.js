import React from "react"
import "../../scss/NotFoundPage.scss"
import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"

const NotFoundPage = () => {
    const { t } = useTranslation()

    return (
        <Box className="errnotfound">
            <img
                src={`${process.env.REACT_APP_API_URL}/img/astronaut_with_magnifying_glass.png`}
                alt="404notfound"
            />
            <h1><span>404</span> {t("notfound")}!!!</h1>
        </Box>
    )
}

export default NotFoundPage