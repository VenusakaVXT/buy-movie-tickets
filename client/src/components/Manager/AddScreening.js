import React, { useEffect, useState } from "react"
import {
    Box,
    FormLabel,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Button
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import { addScreening, getApiFromBE } from "../../api/movieApi"
import { getCinemaRoomFromCinema } from "../../api/cinemaApi"
import { toast } from "react-toastify"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { Vietnamese } from "flatpickr/dist/l10n/vn"
import "../../scss/App.scss"

const AddScreening = ({ title }) => {
    const [inputs, setInputs] = useState({
        movie: "",
        movieDate: "",
        timeSlot: "",
        price: "",
        cinemaRoom: ""
    })
    const [movies, setMovies] = useState([])
    const [cinemaRooms, setCinemaRooms] = useState([])
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        getCinemaRoomFromCinema(localStorage.getItem("cinemaId"))
            .then((res) => setCinemaRooms(res.cinemaRooms))
            .catch((err) => console.error(err))
    }, [])

    const handleChange = (e) => {
        setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const handleChangeDateTime = (date = null, time = null) => {
        if (date) {
            setInputs((prevState) => ({ ...prevState, movieDate: date[0] }))
        } else {
            setInputs((prevState) => ({ ...prevState, timeSlot: time[0] }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await addScreening({ ...inputs })
            if (res !== null) {
                console.log(res)
                navigate("/manager/list-screening")
                toast.success(i18n.language === "en" ? res.message : t("addScreening.toastSuccess"))
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Helmet><title>{title}</title></Helmet>

            <Box className="wrapper">
                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        {t("header.home")}
                    </Typography>
                    <Typography className="breadcrumb__item" textTransform={"capitalize"}>
                        {t("addScreening.title")}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box className="frm-wrapper frm-add-screening">
                        <FormLabel>
                            <span className="txt-span">*</span> {t("cinemaTicket.movie")} (<span className="text-italic">
                                {`${t("addScreening.acronymNowShowing")}: ${t("homepage.nowShowing")}, 
                                ${t("addScreening.acronymCommingSoon")}: ${t("homepage.commingSoon")}`}
                            </span>):
                        </FormLabel>
                        <FormControl fullWidth>
                            <InputLabel className="input-label" id="label-movie">{t("cinemaTicket.movie")}</InputLabel>
                            <Select
                                labelId="label-movie"
                                id="movie"
                                name="movie"
                                label={t("cinemaTicket.movie")}
                                value={inputs.movie}
                                onChange={handleChange}
                                required
                            >
                                {movies.map((movie) =>
                                    <MenuItem key={movie._id} value={movie._id}>
                                        {t(`movies.${movie.slug}`)} ({movie.wasReleased
                                            ? t("addScreening.acronymNowShowing") : t("addScreening.acronymCommingSoon")})
                                    </MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <Box display={"flex"} margin={"8px 0"}>
                            <Box display={"flex"} flexDirection={"column"}>
                                <FormLabel><span className="txt-span">*</span> {t("addScreening.movieDate")}:</FormLabel>
                                <Flatpickr
                                    type="date"
                                    className="calendar"
                                    name="movieDate"
                                    value={inputs.movieDate}
                                    onChange={(date) => handleChangeDateTime(date, null)}
                                    required
                                    options={{
                                        locale: i18n.language === "vi" ? Vietnamese : undefined,
                                        altInput: true,
                                        altFormat: i18n.language === "vi" ? "d/m/Y" : "Y-m-d",
                                        dateFormat: "Y-m-d"
                                    }}
                                />
                            </Box>

                            <Box display={"flex"} flexDirection={"column"}>
                                <FormLabel><span className="txt-span">*</span> {t("addScreening.timeSlot")}:</FormLabel>
                                <Flatpickr
                                    type="time"
                                    className="calendar"
                                    name="timeSlot"
                                    value={inputs.timeSlot}
                                    onChange={(time) => handleChangeDateTime(null, time)}
                                    required
                                    options={{ enableTime: true, noCalendar: true, dateFormat: "H:i K" }}
                                />
                            </Box>
                        </Box>

                        <Box display={"flex"}>
                            <Box display={"flex"} flexDirection={"column"}>
                                <FormLabel>
                                    <span className="txt-span">*</span> {
                                        t("addScreening.price")
                                    } (<span className="text-italic">xx000 = xx.000VNĐ</span>):
                                </FormLabel>
                                <TextField
                                    type="number"
                                    name="price"
                                    variant="standard"
                                    margin="normal"
                                    placeholder={t("addScreening.placeholderPrice")}
                                    value={inputs.price}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "calc(1086px / 2)" }}
                                />
                            </Box>

                            <Box width={"100%"} marginLeft={"8px"}>
                                <FormLabel><span className="txt-span">*</span> {t("addScreening.cinemaRoom")}:</FormLabel>
                                <FormControl fullWidth>
                                    <InputLabel className="input-label" id="label-cinemaRoom">
                                        {t("addScreening.cinemaRoom")}
                                    </InputLabel>
                                    <Select
                                        labelId="label-cinemaRoom"
                                        id="cinemaRoom"
                                        name="cinemaRoom"
                                        label={t("addScreening.cinemaRoom")}
                                        value={inputs.cinemaRoom}
                                        onChange={handleChange}
                                        required
                                    >
                                        {cinemaRooms.map((cinemaRoom) =>
                                            <MenuItem key={cinemaRoom._id} value={cinemaRoom._id}>
                                                {cinemaRoom.roomNumber}
                                            </MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button className="btn lowercase" type="submit">{t("addScreening.title")}</Button>
                        </Box>
                    </Box>
                </form >
            </Box >
        </>
    )
}

export default AddScreening