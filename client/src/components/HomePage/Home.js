import React from "react"
import { Box } from "@mui/material"
import "../../scss/Home.scss"
import Carousel from "./Carousel"
import Banner from "./Banner"

const Home = () => {
    return (
        <Box className="home__wrapper">
            <Carousel />
            <Banner />
        </Box>
    )
}

export default Home