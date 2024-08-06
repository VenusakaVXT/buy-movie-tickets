import React, { useState, useEffect } from "react"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
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
    const { t } = useTranslation()
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
                        {t("header.home")}
                    </Typography>
                    <Typography className="breadcrumb__item">
                        {manager && manager.position === "Manage movies" ? t("header.lstMovie") : t("header.lstScreening")}
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
                                            {t(`movies.${movie.slug}`)}
                                        </Typography>

                                        <ListItemText>{t("movieDetail.time", { time: movie.time })}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("addMovie.releaseDate")}:</Typography>
                                        <ListItemText>{handleDate(movie.releaseDate)}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("header.category")}:</Typography>
                                        <ListItemText>{movie.category[0].category}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("addMovie.producer")}:</Typography>
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
                                            {t(`movies.${screening.movie.slug}`)}
                                        </Typography>

                                        <ListItemText>
                                            {`${screening.timeSlot}-${getEndTime(screening.timeSlot, screening.movie.time)}`}
                                        </ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("addScreening.movieDate")}:</Typography>
                                        <ListItemText>{screening.movieDate}</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("addScreening.price")}:</Typography>
                                        <ListItemText>{screening.price.toLocaleString("vi-VN")} VNĐ</ListItemText>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("addScreening.cinemaRoom")}:</Typography>
                                        <ListItemText>
                                            {screening.cinemaRoom
                                                ? `${screening.cinemaRoom.roomNumber}-${screening.cinemaRoom.cinema.name}`
                                                : t("unknown")}
                                        </ListItemText>
                                    </Box>
                                </ListItem>
                            )
                        }
                    </List> :
                    <NoDataComponent content={t("lstData.noData", {
                        dataName: manager && manager.position === "Manage movies"
                            ? t("lstData.movies")
                            : t("lstData.screenings")
                    })} />}
            </Box> : <Loading />}
        </>
    )
}

export default ListData