import React, { useState, useEffect } from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"
import ScreeningItem from "../Screening/ScreeningItem"
import { getApiFromBE } from "../../api/movieApi"
import "../../scss/Release.scss"

const Release = () => {
    const [movies, setMovies] = useState([])
    const [showing, setShowing] = useState(true)

    useEffect(() => {
        const savedTabState = sessionStorage.getItem("tabState")

        if (savedTabState) {
            setShowing(savedTabState === "now_showing")
        }

        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    const handleTabClick = (val) => {
        if (val !== showing) {
            setShowing(val)
            sessionStorage.setItem("tabState", val ? "now_showing" : "comming_soon")
        }
    }

    const filterMoviesByRelease = (movies, showing) => {
        return movies.filter(
            (movie) => showing ? movie.wasReleased : !movie.wasReleased
        )
    }

    return (
        <Box id="release" className="release__wrapper">
            <h2>
                <span>#</span>RELEASE
            </h2>

            <h4 className="release__title">
                <span
                    className={`release__tab ${showing ? "selected" : ""}`}
                    onClick={() => handleTabClick(true)}
                >
                    NOW SHOWING
                </span>
                <span style={{ padding: "0 8px", fontSize: "40px" }}>|</span>
                <span
                    className={`release__tab ${!showing ? "selected" : ""}`}
                    onClick={() => handleTabClick(false)}
                >
                    COMMING SOON
                </span>
            </h4>

            <Box className="release__list">
                {filterMoviesByRelease(movies, showing)
                    .slice(0, 8)
                    .map((movie, index) => (
                        <ScreeningItem
                            key={index}
                            id={movie.id}
                            title={movie.title}
                            releaseDate={movie.releaseDate}
                            time={movie.time}
                            trailerId={movie.trailerId}
                            displayType={false}
                        />
                    ))}
            </Box>

            <Box className="release__view-all">
                <Button
                    sx={{
                        margin: "auto",
                        color: "#000",
                        borderColor: "#000",
                        ":hover": {
                            fontSize: "15px",
                            background: "#fff",
                            borderColor: "#000"
                        }
                    }}
                    variant="outlined"
                    LinkComponent={Link}
                    to="/all-screening"
                >
                    See All Screenings
                </Button>
            </Box>
        </Box>
    )
}

export default Release
