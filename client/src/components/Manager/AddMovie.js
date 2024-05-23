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
import { addMovie, getApiFromBE } from "../../api/movieApi"
import { Helmet } from "react-helmet"
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

    const handleChange = (e) => {
        setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const handleRadioBtnClick = (event) => {
        const label = event.target.closest("label")
        const targetSvg = label.querySelector(".css-1hbvpl3-MuiSvgIcon-root")

        document.querySelectorAll(".css-1hbvpl3-MuiSvgIcon-root").forEach((option) => {
            option.classList.remove("active")
        })

        targetSvg.classList.add("active")

        const val = label.textContent === "Already"
        setInputs((prevState) => ({ ...prevState, wasReleased: val }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addMovie({ ...inputs })
            .then((res) => {
                console.log(res)
                navigate("/manager/list-movie")
            })
            .catch((err) => console.error(err))
    }

    return (
        <>
            <Helmet><title>{title}</title></Helmet>

            <Box className="wrapper">
                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        Home
                    </Typography>
                    <Typography className="breadcrumb__item">Add Movie</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box className="frm-wrapper">
                        <FormLabel><span className="txt-span">*</span> Movie title:</FormLabel>
                        <TextField
                            name="title"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter movie title..."
                            value={inputs.title}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Movie description:</FormLabel>
                        <TextareaAutosize
                            name="description"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter movie description..."
                            value={inputs.description}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Movie director:</FormLabel>
                        <TextField
                            name="director"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter movie director..."
                            value={inputs.director}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Content writter:</FormLabel>
                        <TextField
                            name="contentWritter"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter content writter..."
                            value={inputs.contentWritter}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Actors:</FormLabel>
                        <TextField
                            name="actors"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter actors..."
                            value={inputs.actors}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Category:</FormLabel>
                        <FormControl fullWidth>
                            <InputLabel className="input-label" id="label-category">Category</InputLabel>
                            <Select
                                labelId="label-category"
                                id="category"
                                name="category"
                                label="Category"
                                value={inputs.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) =>
                                    <MenuItem key={category._id} value={category._id}>{category.category}</MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <FormLabel>
                            <span className="txt-span">*</span> Release date (<span class="text-italic">mm/dd/yyyy</span>):
                        </FormLabel>
                        <input
                            type="date"
                            className="calendar"
                            name="releaseDate"
                            value={inputs.releaseDate}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Movie time:</FormLabel>
                        <TextField
                            type="number"
                            name="time"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter movie time..."
                            value={inputs.time}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Trailer ID:</FormLabel>
                        <TextField
                            name="trailerId"
                            variant="standard"
                            margin="normal"
                            placeholder="Enter trailer id..."
                            value={inputs.trailerId}
                            onChange={handleChange}
                            required
                        />

                        <FormLabel><span className="txt-span">*</span> Producer:</FormLabel>
                        <FormControl fullWidth >
                            <InputLabel className="input-label" id="label-producer">Producer</InputLabel>
                            <Select
                                labelId="label-producer"
                                id="producer"
                                name="producer"
                                label="Producer"
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
                                Was released (<span class="text-italic">If not selected, the default will be "Not yet"</span>):
                            </FormLabel>
                            <RadioGroup row>
                                <FormControlLabel value={true} label="Already" control={<Radio onClick={handleRadioBtnClick} />} />
                                <FormControlLabel value={false} label="Not yet" control={<Radio onClick={handleRadioBtnClick} />} />
                            </RadioGroup>
                        </Box>

                        <input type="hidden" id="wasReleased" name="wasReleased" value={inputs.wasReleased} />

                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button className="btn lowercase" type="submit">Add movie</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default AddMovie