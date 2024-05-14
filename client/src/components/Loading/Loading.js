import React from "react"
import { Box, Typography } from "@mui/material"
import "../../scss/App.scss"

const Loading = () => {
    return (
        <Box 
            height={"100vh"} 
            display={"flex"} 
            alignItems={"center"} 
            justifyContent={"center"}
            flexDirection={"column"}
        >
            <Box className="loading-spinner" margin={"0 auto"}></Box>
            <Typography margin={"10px 0 0 10px"}>LOADING...</Typography>
        </Box>
    )
}

export default Loading