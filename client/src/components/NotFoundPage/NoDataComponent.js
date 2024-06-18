import React from "react"
import { Box, Typography } from "@mui/material"

const NoDataComponent = ({ content }) => {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <img
                src={`${process.env.REACT_APP_API_URL}/img/astronaut_with_magnifying_glass.png`}
                width={"30%"}
                height={"60%"}
                alt="Not found"
            />
            <Typography variant="h5" color={"#2d2d2e"}>{content}</Typography>
        </Box>
    )
}

export default NoDataComponent