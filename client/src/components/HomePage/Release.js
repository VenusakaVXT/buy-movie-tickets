import React, { useState, useEffect } from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"
import ScreeningItem from "../Screening/ScreeningItem"
import { getAllMovies } from "../../api/movieApi"
import "../../scss/Release.scss"

const Release = () => {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div id="release" className="release__wrapper" style={{ height: "1000px" }}>
            <h2><span>#</span>RELEASE</h2>

            <h4 className="release__title">NOW SHOWING</h4>

            <Box className="release__list">
                {movies && movies.slice(0, 8).map((movie, index) => (
                    <ScreeningItem
                        id={movie.id}
                        title={movie.title}
                        posterUrl={movie.posterUrl}
                        releaseDate={movie.releaseDate}
                        key={index}
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
                            color: "#e50914",
                            borderColor: "#e50914",
                            background: "#2b2d42"
                        },
                        ":active": {
                            background: "#2b2d42"
                        }
                    }}
                    variant="outlined"
                    LinkComponent={Link}
                    to="/screening"
                >
                    See All Screenings
                </Button>
            </Box>
        </div>
    )
}

export default Release