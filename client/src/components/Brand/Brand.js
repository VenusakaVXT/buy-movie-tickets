import React from "react"
import { Box, Typography } from "@mui/material"
import MovieIcon from "@mui/icons-material/Movie"

const Brand = () => {
    return (
        <Box textAlign={"center"} padding={"70px 0"}>
            <MovieIcon sx={{ fontSize: "10rem" }} htmlColor="#e50914" />
            <Typography fontSize="2rem" color="#e50914">Buy Movie Tickets</Typography>
            <Typography fontSize="16px" color={"#fff"} marginTop={"5px"}>
                Buy Movie Tickets is the number 1 online movie ticket booking application in Vietnam
            </Typography>
        </Box>
    )
}

export default Brand