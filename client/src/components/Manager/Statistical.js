import React from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import "../../scss/App.scss"

const Statistical = ({ title }) => {
    const navigate = useNavigate()

    return (
        <>
            <Helmet><title>{title}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item">Statistical</Typography>
            </Box>
        </>
    )
}

export default Statistical