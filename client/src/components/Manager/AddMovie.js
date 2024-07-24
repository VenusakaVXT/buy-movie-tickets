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
    TextareaAutosize,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { addMovie, getApiFromBE } from "../../api/movieApi"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { convertStr } from "../../util"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { Vietnamese } from "flatpickr/dist/l10n/vn"
import "../../scss/App.scss"

const AddMovie = ({ title }) => {
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        director: "",
        contentWritter: "",
        actors: "",
        category: "",
        releaseDate: "",
        time: "",
        trailerId: "",
        producer: "",
        wasReleased: false
    })
    const [categories, setCategories] = useState([])
    const [producers, setProducers] = useState([])
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        getApiFromBE("category")
            .then((res) => setCategories(res.categories))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        getApiFromBE("producer")
            .then((res) => setProducers(res.producers))
            .catch((err) => console.error(err))
    }, [])

    // Fix ResizeObserver
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            try {
                for (let entry of entries) {
                    console.log("Element resized:", entry.target)
                    console.log("New size:", entry.contentRect.width, "x", entry.contentRect.height)
                }
            } catch (err) {
                console.error("ResizeObserver error:", err)
            }
        })

        const textarea = document.querySelector("textarea")
        if (textarea) { resizeObserver.observe(textarea) }

        return () => { resizeObserver.disconnect() }
    }, [])

    const handleChange = (e, date = null) => {
        if (date) {
            setInputs((prevState) => ({ ...prevState, releaseDate: date[0] }))
        } else {
            setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
        }
    }

    const handleRadioBtnClick = (event) => {
        const label = event.target.closest("label")
        const queryClass = ".frm-wrapper .css-1hbvpl3-MuiSvgIcon-root"
        const targetSvg = label.querySelector(queryClass)

        document.querySelectorAll(queryClass).forEach((option) => {
            option.classList.remove("active")
        })

        targetSvg.classList.add("active")

        const val = label.textContent === t("addMovie.already")
        setInputs((prevState) => ({ ...prevState, wasReleased: val }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await addMovie({ ...inputs })
            if (res !== null) {
                console.log(res)
                navigate("/manager/list-movie")
                toast.success(i18n.language === "us" ? res.message : t("addMovie.toastSuccess"))
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
                        {t("addMovie.title")}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box className="frm-wrapper frm-add-movie">
                        <FormLabel><span className="txt-span">*</span> {t("addMovie.movieTitle")}:</FormLabel>
                        <TextField
                            name="title"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderMovieTitle")}
                            value={inputs.title}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> {t("addMovie.movieDescription")}:</FormLabel>
                        <TextareaAutosize
                            name="description"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderMovieDescription")}
                            value={inputs.description}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel>
                            <span className="txt-span">*</span> {t("addMovie.movieDirector")} (<span class="text-italic">
                                {t("addMovie.noteActors")}
                            </span>):
                        </FormLabel>
                        <TextField
                            name="director"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderMovieDirector")}
                            value={inputs.director}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel>
                            <span className="txt-span">*</span> {t("addMovie.contentWritter")} (<span class="text-italic">
                                {t("addMovie.noteActors")}
                            </span>):
                        </FormLabel>
                        <TextField
                            name="contentWritter"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderContentWritter")}
                            value={inputs.contentWritter}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel>
                            <span className="txt-span">*</span> {t("addMovie.actors")} (<span class="text-italic">
                                {t("addMovie.noteActors")}
                            </span>):
                        </FormLabel>
                        <TextField
                            name="actors"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderActors")}
                            value={inputs.actors}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> {t("header.category")}:</FormLabel>
                        <FormControl fullWidth>
                            <InputLabel className="input-label" id="label-category">{t("header.category")}</InputLabel>
                            <Select
                                labelId="label-category"
                                id="category"
                                name="category"
                                label={t("header.category")}
                                value={inputs.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) =>
                                    <MenuItem key={category._id} value={category._id}>
                                        {t(`category.${convertStr(category.category)}`)}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <FormLabel>
                            <span className="txt-span">*</span> {t("addMovie.releaseDate")} (<span class="text-italic">
                                {i18n.language === "us" ? "yyyy-mm-dd" : "mm/dd/yyyy"}
                            </span>):
                        </FormLabel>
                        <Flatpickr
                            type="date"
                            className="calendar"
                            name="releaseDate"
                            value={inputs.releaseDate}
                            onChange={(date) => handleChange(null, date)}
                            required
                            options={{
                                locale: i18n.language === "vn" ? Vietnamese : undefined,
                                altInput: true,
                                altFormat: i18n.language === "vn" ? "d/m/Y" : "Y-m-d",
                                dateFormat: "Y-m-d"
                            }}
                        />

                        <FormLabel>
                            <span className="txt-span">*</span> {t("addMovie.movieTime")} (<span class="text-italic">
                                {t("addMovie.noteMovieTime")}
                            </span>):
                        </FormLabel>
                        <TextField
                            type="number"
                            name="time"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderMovieTime")}
                            value={inputs.time}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel>
                            <span className="txt-span">*</span> Trailer ID (<span class="text-italic">
                                https://www.youtube.com/watch?v=trailerId
                            </span>):
                        </FormLabel>
                        <TextField
                            name="trailerId"
                            variant="standard"
                            margin="normal"
                            placeholder={t("addMovie.placeholderTrailerId")}
                            value={inputs.trailerId}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> {t("addMovie.producer")}:</FormLabel>
                        <FormControl fullWidth>
                            <InputLabel className="input-label" id="label-producer">{t("addMovie.producer")}</InputLabel>
                            <Select
                                labelId="label-producer"
                                id="producer"
                                name="producer"
                                label={t("addMovie.producer")}
                                value={inputs.producer}
                                onChange={handleChange}
                                required
                            >
                                {producers.map((producer) =>
                                    <MenuItem key={producer._id} value={producer._id}>{producer.producerName}</MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <Box display={"flex"}>
                            <FormLabel sx={{ paddingRight: "10px", lineHeight: 2.5 }}>
                                {t("addMovie.wasReleased")} (<span class="text-italic">
                                    {t("addMovie.noteWasReleased")} "{t("addMovie.notYet")}"
                                </span>):
                            </FormLabel>
                            <RadioGroup row>
                                <FormControlLabel value={true} label={t("addMovie.already")} control={
                                    <Radio onClick={handleRadioBtnClick} />
                                } />
                                <FormControlLabel value={false} label={t("addMovie.notYet")} control={
                                    <Radio onClick={handleRadioBtnClick} />
                                } />
                            </RadioGroup>
                        </Box>

                        <input type="hidden" id="wasReleased" name="wasReleased" value={inputs.wasReleased} />

                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button className="btn lowercase" type="submit">{t("addMovie.title")}</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default AddMovie