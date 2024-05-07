import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { getMovieDetail } from "../../api/movieApi"
import "../../scss/App.scss"
import "../../scss/Booking.scss"

const Booking = () => {
    const [movie, setMovie] = useState()
    const slug = useParams().slug
    const navigate = useNavigate()

    useEffect(() => {
        getMovieDetail(slug)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.error(err))
    }, [slug])

    return (
        <>
            {movie && <Box className="booking__wrapper">
                <Box className="breadcrumb">
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        Home
                    </Typography>
                    <Typography className="breadcrumb__item disable">All Screenings</Typography>
                    <Typography className="breadcrumb__item">{movie.title}</Typography>
                </Box>
            </Box>}
        </>
    )
}

export default Booking