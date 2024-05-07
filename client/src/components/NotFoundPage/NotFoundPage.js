import React from "react"
import "../../scss/NotFoundPage.scss"
import { Box } from "@mui/material"

const NotFoundPage = () => {
    return (
        <Box className="errnotfound">
            <img
                src="http://localhost:5000/img/astronaut_with_magnifying_glass.png"
                alt="404notfound"
            />
            <h1>
                <span>404</span> Not Found!!!
            </h1>
        </Box>
    )
}

export default NotFoundPage