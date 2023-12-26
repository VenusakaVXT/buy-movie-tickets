import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import getApiFromBE from "../../api/movieApi"
import ScreeningItem from "../Screening/ScreeningItem"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import "../../scss/Movie.scss"

const Movie = () => {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    const filterMoviesByRelease = (isReleased) => {
        return movies.filter((movie) => movie.wasReleased === isReleased)
    }

    const renderMovieList = (title, isReleased) => (
        <>
            <Typography variant="h5" color={"#fff"} paddingLeft={"calc(66px + 16px)"}>
                <ConfirmationNumberIcon 
                    htmlColor="#ff0000" 
                    sx={{ 
                        position: "relative", 
                        bottom: "-3px",
                        paddingRight: "5px"
                    }} 
                />
                {title.toUpperCase()}
            </Typography>

            <Box className="movie__list">
                {filterMoviesByRelease(isReleased).map((movie, index) => (
                    <ScreeningItem 
                        key={index}
                        id={movie._id}
                        title={movie.title}
                        releaseDate={movie.releaseDate}
                        trailerId={movie.trailerId}
                    />
                ))}
            </Box>
        </>
    )

    return (
        <Box className="movie__wrappper">
            <Box className="breadcrumb">
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item">
                    All Screening
                </Typography>
            </Box>

            <Typography textAlign={"center"} variant="h4" color={"#fff"} margin={"30px auto"}>
                <span style={{ color: "#ff0000" }}>#</span>ALL SCREENINGS
            </Typography>

            {renderMovieList("now showing", true)}
            {renderMovieList("comming soon", false)}
        </Box>
    )
}

export default Movie
