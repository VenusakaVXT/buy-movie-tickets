import React, { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getApiFromBE } from "../../api/movieApi"
import ScreeningItem from "../Screening/ScreeningItem"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import AppsIcon from "@mui/icons-material/Apps"
import ViewListIcon from "@mui/icons-material/ViewList"
import "../../scss/Movie.scss"

const Movie = () => {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([])
    const [active, setActive] = useState(0)
    const [sort, setSort] = useState(0)
    // boolean array that tracks the state of tabs
    const [tabStates, setTabStates] = useState([true, false])

    const listSelectSort = [
        "Relevance",
        "Name (A - Z)",
        "Price (Low - High)"
    ]

    useEffect(() => {
        const storedActiveTab = sessionStorage.getItem("activeTab")

        if (storedActiveTab !== null) {
            setActive(Number(storedActiveTab))
            // When a tab is selected 
            // create a new array with only one element with value `true`
            // corresponding to the selected tab
            setTabStates((prevTabStates) => prevTabStates.map(
                (_, index) => index === Number(storedActiveTab)
            ))
        } else {
            setActive(0)
            setTabStates([true, false])
        }

        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    const filterMoviesByRelease = (isReleased) => {
        return movies.filter((movie) => movie.wasReleased === isReleased)
    }

    const renderMovieList = (title, isReleased) => (
        <>
            <Typography variant="h5" color={"#fff"} paddingLeft={"16px"}>
                <ConfirmationNumberIcon
                    htmlColor="#ff0000"
                    sx={{
                        position: "relative",
                        bottom: "-3px",
                        paddingRight: "5px"
                    }}
                />
                {title.toUpperCase()}
            </Typography>

            <div role="tab" hidden={active !== 0}>
                <Box className="movie__list">
                    {filterMoviesByRelease(isReleased).map((movie, index) => (
                        <ScreeningItem
                            key={index}
                            id={movie._id}
                            title={movie.title}
                            description={movie.description}
                            releaseDate={movie.releaseDate}
                            time={movie.time}
                            trailerId={movie.trailerId}
                            displayType={true}
                        />
                    ))}
                </Box>
            </div>

            <div role="tab" hidden={active !== 1}>
                <Box className="movie__list">
                    {filterMoviesByRelease(isReleased).map((movie, index) => (
                        <ScreeningItem
                            key={index}
                            id={movie._id}
                            title={movie.title}
                            releaseDate={movie.releaseDate}
                            time={movie.time}
                            trailerId={movie.trailerId}
                            displayType={false}
                        />
                    ))}
                </Box>
            </div>
        </>
    )

    const handleTabChange = (_, newActive) => {
        const newTabState = tabStates.map((_, index) => index === newActive)

        setTabStates(newTabState)
        setActive(newActive)

        sessionStorage.setItem("activeTab", newActive.toString())
    }

    return (
        <Box className="movie__wrappper">
            <Box className="breadcrumb">
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item">
                    All Screening
                </Typography>
            </Box>

            <Typography textAlign={"center"} variant="h4" color={"#fff"} marginTop={"30px"}>
                <span style={{ color: "#ff0000" }}>#</span>ALL SCREENINGS
            </Typography>

            <Box className="topbar">
                <Box className="topbar__item">
                    <Tabs
                        value={active}
                        onChange={handleTabChange}
                        aria-label="Toogle tab"
                        indicatorColor="transparent"
                    >
                        <Tab
                            className="topbar__tab"
                            label={<ViewListIcon className={
                                `topbar__tab-icon ${tabStates[0] ? "topbar__tab-active" : ""}`
                            } />}
                            aria-selected={active === 0}
                            style={{ marginRight: "8px" }}
                        />
                        <Tab
                            className="topbar__tab"
                            label={<AppsIcon className={
                                `topbar__tab-icon ${tabStates[1] ? "topbar__tab-active" : ""}`
                            } />}
                            aria-selected={active === 1}
                        />
                    </Tabs>

                    <Typography marginLeft={4}>{`There are ${movies.length} movies.`}</Typography>
                </Box>

                <Box className="topbar__item">
                    <Typography marginRight={2}>Sort by:</Typography>

                    <FormControl sx={{
                        width: "250px",
                        ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff"
                        },
                        ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": {
                            padding: "8px",
                            color: "#fff"
                        },
                        ".css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
                            color: "#fff"
                        },
                        ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                            color: "#fff"
                        }
                    }}>
                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            defaultValue={0}
                        >
                            {listSelectSort.map((item, index) => (
                                <MenuItem value={index}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {renderMovieList("now showing", true)}
            {renderMovieList("comming soon", false)}
        </Box>
    )
}

export default Movie
