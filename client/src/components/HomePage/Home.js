import React from "react"
import { Box } from "@mui/material"
import "../../scss/Home.scss"
import Carousel from "./Carousel"
import Banner from "./Banner"
import Release from "./Release"
import Category from "./Category"
import Cinema from "./Cinema"

const Home = () => {
    return (
        <Box className="home__wrapper">
            <Carousel />
            <Banner />
            <Release />
            <Category />
            <Cinema />
        </Box>
    )
}

export default Home