import React, { useCallback, useEffect, useState } from "react"
import { Box, Typography, Menu, MenuItem } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getEndTime } from "../../util"
import {
    getMovieDetail,
    getApiFromBE,
    getScreeningsByMovie,
    getCurrentDateAnd7DaysLater,
    getScreeningsByDate,
    getScreeningsByCinema,
    getScreeningsByCinemaAndDate
} from "../../api/movieApi"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"
import FilterListIcon from "@mui/icons-material/FilterList"
import { ScreeningFilter } from "../../util/constants/screening"
import { OrderBy } from "../../util/constants/order"
import "../../scss/App.scss"
import "../../scss/Booking.scss"

const Booking = () => {
    const [movie, setMovie] = useState()
    const [cinemas, setCinemas] = useState()
    const [dates, setDates] = useState([])
    const [screenings, setScreenings] = useState()
    const [selectedCinema, setSelectedCinema] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [sort, setSort] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const slug = useParams().slug
    const navigate = useNavigate()
    const { t } = useTranslation()

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
        getCurrentDateAnd7DaysLater()
            .then((data) => setDates(data.dates))
            .catch((err) => console.error(err))
    }, [])

    const handleSort = useCallback((sortOption) => {
        switch (sortOption) {
            case "movieDateAsc":
                getScreeningsByMovie(slug, ScreeningFilter.SCREENING_DATE, OrderBy.ASC)
                    .then((res) => setScreenings(res.screenings))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "movieDateDesc":
                getScreeningsByMovie(slug, ScreeningFilter.SCREENING_DATE, OrderBy.DESC)
                    .then((res) => setScreenings(res.screenings))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "priceAsc":
                getScreeningsByMovie(slug, ScreeningFilter.SCREENING_PRICE, OrderBy.ASC)
                    .then((res) => setScreenings(res.screenings))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "priceDesc":
                getScreeningsByMovie(slug, ScreeningFilter.SCREENING_PRICE, OrderBy.DESC)
                    .then((res) => setScreenings(res.screenings))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            default:
                renderAllScreenings(slug)
                break
        }
    }, [slug])

    useEffect(() => {
        setIsLoading(true)
        handleSort(sort)
    }, [sort, handleSort])

    const renderAllScreenings = (slug) => {
        getScreeningsByMovie(slug, "", "")
            .then((res) => setScreenings(res.screenings))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }

    const handleSelectActive = (target, queryClass) => {
        document.querySelectorAll(queryClass).forEach((item) => {
            if (item !== target) {
                item.classList.remove("active")
            }
        })
        target.classList.add("active")
    }

    const handleSelectCinema = (event, cinemaId) => {
        const { target } = event

        handleSelectActive(target, ".cinema__list .cinema__item")
        setSelectedCinema(cinemaId)
        setIsLoading(true)

        if (cinemaId && selectedDate) {
            getScreeningsByCinemaAndDate(slug, selectedDate, cinemaId)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (cinemaId) {
            getScreeningsByCinema(cinemaId, slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (selectedDate) {
            getScreeningsByDate(slug, selectedDate)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else {
            renderAllScreenings(slug)
        }
    }

    const handleSelectDate = (event, date) => {
        const { target } = event

        handleSelectActive(target, ".lst-dates .date-item")
        setSelectedDate(date)
        setIsLoading(true)

        if (date && selectedCinema) {
            getScreeningsByCinemaAndDate(slug, date, selectedCinema)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (date) {
            getScreeningsByDate(slug, date)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else if (selectedCinema) {
            getScreeningsByCinema(selectedCinema, slug)
                .then((res) => setScreenings(res.screenings))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false))
        } else {
            renderAllScreenings(slug)
        }
    }

    const handleClose = () => setAnchorEl(null)

    const handleMenuItemClick = (e) => {
        const value = e.currentTarget.getAttribute("value")
        setSort(value)
        handleClose()
    }

    return (
        <>
            {movie &&
                <Box className="booking__wrapper">
                    <Helmet>
                        <title>
                            {formatTitle(`${t("movieDetail.booking")} ${t(`movies.${movie.slug}`)}`)}
                        </title>
                    </Helmet>

                    <Box className="breadcrumb" margin={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            {t("header.home")}
                        </Typography>
                        <Typography className="breadcrumb__item disable">{t("booking.allScreenings")}</Typography>
                        <Typography className="breadcrumb__item">{t(`movies.${movie.slug}`)}</Typography>
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>{t("booking.selectCinema")}</Typography>

                    <Box className="cinema__list">
                        <Typography className="cinema__item active" onClick={(e) => {
                            handleSelectCinema(e, "")
                        }}>
                            {t("booking.allCinemas")}
                        </Typography>

                        {cinemas.map((cinema) => (
                            <Typography key={cinema._id} className="cinema__item" onClick={(e) => {
                                handleSelectCinema(e, cinema._id)
                            }}>
                                {cinema.name}
                            </Typography>
                        ))}
                    </Box>

                    <Typography color={"#fff"} paddingTop={2}>{t("booking.selectDate")}</Typography>

                    <Box className="lst-dates">
                        <Typography className="date-item active" onClick={(e) => {
                            handleSelectDate(e, "")
                        }}>
                            {t("booking.allDays")}
                        </Typography>

                        {dates.map((date) => (
                            <Typography key={date} className="date-item" onClick={(e) => {
                                handleSelectDate(e, date)
                            }}>
                                {date}
                            </Typography>
                        ))}
                    </Box>

                    <Box display={"flex"} justifyContent={"space-between"} paddingTop={2} color={"#fff"}>
                        <Typography>{t("booking.movieScreenings")}</Typography>

                        <FilterListIcon cursor="pointer" onClick={(e) => setAnchorEl(e.currentTarget)} />

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem value="" onClick={handleMenuItemClick}>
                                {t("selectSort.unprecedented")}
                            </MenuItem>
                            <MenuItem value="movieDateAsc" onClick={handleMenuItemClick}>
                                {`${t("addScreening.movieDate")} (${t("selectSort.low")}-${t("selectSort.high")})`}
                            </MenuItem>
                            <MenuItem value="movieDateDesc" onClick={handleMenuItemClick}>
                                {`${t("addScreening.movieDate")} (${t("selectSort.high")}-${t("selectSort.low")})`}
                            </MenuItem>
                            <MenuItem value="priceAsc" onClick={handleMenuItemClick}>
                                {`${t("addScreening.price")} (${t("selectSort.low")}-${t("selectSort.high")})`}
                            </MenuItem>
                            <MenuItem value="priceDesc" onClick={handleMenuItemClick}>
                                {`${t("addScreening.price")} (${t("selectSort.high")}-${t("selectSort.low")})`}
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Box className="screening__list">
                        {isLoading ? <Box mb={12}><Box className="loading-spinner"></Box></Box> :
                            screenings && screenings.length !== 0 ? screenings.map((screening) => (
                                <Box className="screening__item" key={screening._id} onClick={() =>
                                    navigate(`/booking/${slug}/${screening._id}`)
                                }>
                                    <Box>
                                        <Typography>{t("booking.movieDate")}</Typography>
                                        <Typography>{screening.movieDate}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>{t("booking.startTime")}</Typography>
                                        <Typography>{screening.timeSlot}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>{t("booking.endTime")}</Typography>
                                        <Typography>{getEndTime(screening.timeSlot, movie.time)}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>{t("booking.cinemaRoom")}</Typography>
                                        <Typography>{screening.cinemaRoom.roomNumber}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography>{t("addScreening.price")}</Typography>
                                        <Typography>{screening.price}</Typography>
                                    </Box>
                                </Box>
                            )) : <NoDataComponent content={t("booking.noData")} />}
                    </Box>
                </Box>
            }
        </>
    )
}

export default Booking