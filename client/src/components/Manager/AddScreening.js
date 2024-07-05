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
import { Helmet } from "react-helmet"
import { addScreening, getApiFromBE } from "../../api/movieApi"
import { getCinemaRoomFromCinema } from "../../api/cinemaApi"
import { toast } from "react-toastify"
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await addScreening({ ...inputs })
            if (res !== null) {
                console.log(res)
                navigate("/manager/list-screening")
                toast.success(res.message)
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
                        Home
                    </Typography>
                    <Typography className="breadcrumb__item">Add Screening</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box className="frm-wrapper">
                        <FormLabel>
                            <span className="txt-span">*</span> Movie (
                            <span className="text-italic">NS: Now Showing, CM: Comming Soon</span>
                            ):
                        </FormLabel>
                        <FormControl fullWidth>
                            <InputLabel className="input-label" id="label-movie">Movie</InputLabel>
                            <Select
                                labelId="label-movie"
                                id="movie"
                                name="movie"
                                label="Movie"
                                value={inputs.movie}
                                onChange={handleChange}
                                required
                            >
                                {movies.map((movie) =>
                                    <MenuItem key={movie._id} value={movie._id}>
                                        {movie.title} ({movie.wasReleased ? "NS" : "CM"})
                                    </MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <Box display={"flex"} margin={"8px 0"}>
                            <Box>
                                <FormLabel><span className="txt-span">*</span> Movie date:</FormLabel>
                                <input
                                    type="date"
                                    className="calendar"
                                    name="movieDate"
                                    value={inputs.movieDate}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "calc(1086px / 2)" }}
                                />
                            </Box>

                            <Box>
                                <FormLabel><span className="txt-span">*</span> Time slot:</FormLabel>
                                <input
                                    type="time"
                                    className="calendar"
                                    name="timeSlot"
                                    value={inputs.timeSlot}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "calc((1086px / 2) - 8px)", height: "55px", marginLeft: "8px" }}
                                />
                            </Box>
                        </Box>

                        <Box display={"flex"}>
                            <Box display={"flex"} flexDirection={"column"}>
                                <FormLabel>
                                    <span className="txt-span">*</span> Price (
                                    <span className="text-italic">xx000 = xx.000VNĐ</span>
                                    ):
                                </FormLabel>
                                <TextField
                                    type="number"
                                    name="price"
                                    variant="standard"
                                    margin="normal"
                                    placeholder="Enter price..."
                                    value={inputs.price}
                                    onChange={handleChange}
                                    required
                                    style={{ width: "calc(1086px / 2)" }}
                                />
                            </Box>

                            <Box width={"100%"} marginLeft={"8px"}>
                                <FormLabel><span className="txt-span">*</span> Cinema room:</FormLabel>
                                <FormControl fullWidth>
                                    <InputLabel className="input-label" id="label-cinemaRoom">Cinema room</InputLabel>
                                    <Select
                                        labelId="label-cinemaRoom"
                                        id="cinemaRoom"
                                        name="cinemaRoom"
                                        label="Cinema room"
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
                            <Button className="btn lowercase" type="submit">Add screening</Button>
                        </Box>
                    </Box>
                </form >
            </Box >
        </>
    )
}

export default AddScreening