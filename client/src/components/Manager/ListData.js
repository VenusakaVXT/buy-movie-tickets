import React, { useState, useEffect } from "react"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { getManagerProfile } from "../../api/userApi"
import { handleDate, getEndTime } from "../../util"
import Loading from "../Loading/Loading"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import "../../scss/App.scss"
import "../../scss/Cart.scss"

const ListData = ({ title }) => {
    const [manager, setManager] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const dataName = manager && manager.position === "Manage movies" ? "movies" : "screenings"
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)

        getManagerProfile(localStorage.getItem("managerId"))
            .then((res) => setManager(res.manager))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <>
            {manager && !isLoading ? <Box className="wrapper cart__wrapper">
                <Helmet><title>{title}</title></Helmet>

                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        Home
                    </Typography>
                    <Typography className="breadcrumb__item">
                        {`List ${manager && manager.position === "Manage movies" ? "Movie" : "Screening"}`}
                    </Typography>
                </Box>

                {manager && (manager.addedMovies.length > 0 || manager.addedScreenings.length > 0) ?
                    <List
                        className="list-data"
                        sx={{
                            mb: (manager.addedMovies.length < 3 && manager.addedScreenings.length === 0)
                                || (manager.addedMovies.length === 0 && manager.addedScreenings.length < 3)
                                ? 17 : 0
                        }}
                    >
                        {manager && manager.position === "Manage movies" && manager.addedMovies.length > 0 &&
                            manager.addedMovies.map((movie) =>
                                <ListItem key={movie._id} className="data-item">
                                    <img
                                        src={`https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg`}
                                        alt={movie.slug}
                                    />

                                    <Box className="col1">
                                        <Typography className="link" onClick={() =>
                                            navigate(`/movie-details/${movie.slug}`)
                                        }>
                                            {movie.title}
                                        </Typography>

                                        <ListItemText>{`Time: ${movie.time} minute`}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Release date:</Typography>
                                        <ListItemText>{handleDate(movie.releaseDate)}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Category:</Typography>
                                        <ListItemText>{movie.category[0].category}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Producer:</Typography>
                                        <ListItemText>{movie.producer[0].producerName}</ListItemText>
                                    </Box>
                                </ListItem>
                            )
                        }

                        {manager && manager.position === "Manage screenings" && manager.addedScreenings.length > 0 &&
                            manager.addedScreenings.map((screening) =>
                                <ListItem key={screening._id} className="data-item">
                                    <img
                                        src={`https://img.youtube.com/vi/${screening.movie.trailerId}/maxresdefault.jpg`}
                                        alt={screening.movie.slug}
                                    />

                                    <Box className="col1">
                                        <Typography className="link" onClick={() =>
                                            navigate(`/movie-details/${screening.movie.slug}`)
                                        }>
                                            {screening.movie.title}
                                        </Typography>

                                        <ListItemText>
                                            {`${screening.timeSlot}-${getEndTime(screening.timeSlot, screening.movie.time)}`}
                                        </ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Movie date:</Typography>
                                        <ListItemText>{screening.movieDate}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Price:</Typography>
                                        <ListItemText>{screening.price.toLocaleString("vi-VN")} VNĐ</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Cinema room:</Typography>
                                        <ListItemText>
                                            {screening.cinemaRoom
                                                ? `${screening.cinemaRoom.roomNumber}-${screening.cinemaRoom.cinema.name}`
                                                : "Unknown"}
                                        </ListItemText>
                                    </Box>
                                </ListItem>
                            )
                        }
                    </List> :
                    <NoDataComponent content={`You haven't added any ${dataName} yet`} />}
            </Box> : <Loading />}
        </>
    )
}

export default ListData