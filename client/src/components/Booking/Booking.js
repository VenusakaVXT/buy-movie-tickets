import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { getEndTime } from "../../util"
import {
    getMovieDetail,
    getApiFromBE,
    getScreeningsByMovie,
    getScreeningsByCinema
} from "../../api/movieApi"
import "../../scss/App.scss"
import "../../scss/Booking.scss"

const Booking = () => {
    const [movie, setMovie] = useState()
    const [cinemas, setCinemas] = useState()
    const [screenings, setScreenings] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const slug = useParams().slug
    const navigate = useNavigate()

    useEffect(() => {
        getMovieDetail(slug)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.error(err))
    }, [slug])

    useEffect(() => {
        getApiFromBE("cinema")
            .then((data) => setCinemas(data.cinemas))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        setIsLoading(true)

        getScreeningsByMovie(slug)
            .then((res) => setScreenings(res.screenings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [slug])

    const handleCinemaItemClick = (event, id) => {
        const { target } = event

        document.querySelectorAll(".cinema__item").forEach((item) => {
            if (item !== target) {
                item.classList.remove("active")
            }
        })
        target.classList.add("active")

        setIsLoading(true)

        if (id.toString() !== "") {
            getScreeningsByCinema(id, slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else {
            getScreeningsByMovie(slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        }
    }

    return (
        <>
            {movie &&
                <Box className="booking__wrapper">
                    <Box className="breadcrumb" margin={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            Home
                        </Typography>
                        <Typography className="breadcrumb__item disable">All Screenings</Typography>
                        <Typography className="breadcrumb__item">{movie.title}</Typography>
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>Choose a cinema</Typography>

                    <Box className="cinema__list">
                        <Typography className="cinema__item active" onClick={(e) => {
                            handleCinemaItemClick(e, "")
                        }}>
                            All Cinemas
                        </Typography>

                        {cinemas.map((cinema) => (
                            <Typography key={cinema._id} className="cinema__item" onClick={(e) => {
                                handleCinemaItemClick(e, cinema._id)
                            }}>
                                {cinema.name}
                            </Typography>
                        ))}
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>Movie screenings:</Typography>

                    <Box className="screening__list">
                        {isLoading ? <Box className="loading-spinner"></Box> :
                            screenings && screenings.length !== 0 ? screenings.map((screening) => (
                                <Box className="screening__item" key={screening._id} onClick={() => {
                                    //localStorage.setItem("screeningId", screening._id)
                                    navigate(`/booking/${slug}/${screening._id}`)
                                }}>
                                    <Box>
                                        <Typography>Movie Date</Typography>
                                        <Typography>{screening.movieDate}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>Start Time</Typography>
                                        <Typography>{screening.timeSlot}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>End Time</Typography>
                                        <Typography>{getEndTime(screening.timeSlot, movie.time)}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>Cinema Room</Typography>
                                        <Typography>{screening.cinemaRoom.roomNumber}</Typography>
                                    </Box>
                                </Box>
                            )) :
                                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/img/astronaut_with_magnifying_glass.png`}
                                        width={"30%"}
                                        height={"60%"}
                                        alt="Not found"
                                    />
                                    <Typography variant="h5" color={"#2d2d2e"}>
                                        Sorry!!! No screenings found for this movie :/
                                    </Typography>
                                </Box>}
                    </Box>
                </Box>
            }
        </>
    )
}

export default Booking