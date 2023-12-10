import React, { useState, useEffect } from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"
import ScreeningItem from "../Screening/ScreeningItem"
import { getAllMovies } from "../../api/movieApi"
import "../../scss/Release.scss"

const Release = () => {
    const [movies, setMovies] = useState([])
    const [showing, setShowing] = useState(true)

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    const handleTabClick = (val) => {
        if (val !== showing) {
            setShowing(val)
        }
    }
    return (
        <div id="release" className="release__wrapper" style={{ height: "1000px" }}>
            <h2><span>#</span>RELEASE</h2>

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
                {movies && (showing ? movies.slice(0, 8) : movies.slice(movies.length - 8, movies.length))
                    .map((movie, index) => (
                        <ScreeningItem
                            id={movie.id}
                            title={movie.title}
                            trailerId={movie.trailerId}
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