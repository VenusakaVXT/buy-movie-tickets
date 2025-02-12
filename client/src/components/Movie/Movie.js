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
import { useTranslation } from "react-i18next"
import { getAllMovies, getApiFromBE } from "../../api/movieApi"
import ScreeningItem from "../Screening/ScreeningItem"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import AppsIcon from "@mui/icons-material/Apps"
import ViewListIcon from "@mui/icons-material/ViewList"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"
import "../../scss/App.scss"
import "../../scss/Movie.scss"
import { MovieFilter } from "../../util/constants/movie"
import { OrderBy } from "../../util/constants/order"

const Movie = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [movies, setMovies] = useState([])
    const [active, setActive] = useState(0)
    const [sort, setSort] = useState("normal")
    const [isLoading, setIsLoading] = useState(false)
    const [tabStates, setTabStates] = useState([true, false])
    const [expandedLists, setExpandedLists] = useState({ nowShowing: true, comingSoon: true })

    useEffect(() => {
        const storedActiveTab = sessionStorage.getItem("activeTab")

        if (storedActiveTab !== null) {
            setActive(Number(storedActiveTab))
            setTabStates((prevTabStates) => prevTabStates.map(
                (_, index) => index === Number(storedActiveTab)
            ))
        } else {
            setActive(0)
            setTabStates([true, false])
        }

        setIsLoading(true)
        handleSort(sort)
    }, [sort])

    const handleSort = (sortOption) => {
        switch (sortOption) {
            case "movieTitleAsc":
                getAllMovies(MovieFilter.MOVIE_TITLE, OrderBy.ASC)
                    .then((data) => setMovies(data.movies))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "movieTitleDesc":
                getAllMovies(MovieFilter.MOVIE_TITLE, OrderBy.DESC)
                    .then((data) => setMovies(data.movies))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "movieTimeAsc":
                getAllMovies(MovieFilter.MOVIE_TIME, OrderBy.ASC)
                    .then((data) => setMovies(data.movies))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case "movieTimeDesc":
                getAllMovies(MovieFilter.MOVIE_TIME, OrderBy.DESC)
                    .then((data) => setMovies(data.movies))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            default:
                getApiFromBE("movie")
                    .then((data) => setMovies(data.movies))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
        }
    }

    const filterMoviesByRelease = (isReleased) => {
        return movies.filter((movie) => movie.wasReleased === isReleased)
    }

    const toggleExpandedList = (listKey) => {
        setExpandedLists((prev) => ({ ...prev, [listKey]: !prev[listKey] }))
    }

    const renderMovieList = (title, isReleased, listKey) => (
        <>
            <Typography
                variant="h5"
                color={"#fff"}
                paddingLeft={"16px"}
                onClick={() => toggleExpandedList(listKey)}
                sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
                <ConfirmationNumberIcon htmlColor="#ff0000" sx={{ paddingRight: "5px" }} />
                {title.toUpperCase()}
                {expandedLists[listKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Typography>

            {expandedLists[listKey] && (
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
                                slug={movie.slug}
                                displayType={true}
                            />
                        ))}
                    </Box>
                </div>
            )}

            {expandedLists[listKey] && (
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
                                slug={movie.slug}
                                displayType={false}
                            />
                        ))}
                    </Box>
                </div>
            )}
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
            <Helmet><title>{formatTitle(t("moviePage.allMovies"))}</title></Helmet>

            <Box className="breadcrumb">
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                <Typography className="breadcrumb__item">
                    {t("moviePage.allMovies")}
                </Typography>
            </Box>

            <Typography textAlign={"center"} variant="h4" color={"#fff"} marginTop={"30px"}>
                <span style={{ color: "#ff0000" }}>#</span>{t("moviePage.allMovies").toUpperCase()}
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

                    <Typography marginLeft={2}>{t("moviePage.moviesCount", { count: movies.length })}</Typography>
                </Box>

                <Box className="topbar__item">
                    <Typography marginRight={1}>{t("moviePage.sortBy")}</Typography>

                    <FormControl sx={{
                        width: "250px",
                        ".css-1d3z3hw-MuiOutlinedInput-notchedOutline, .css-igs3ac": {
                            borderColor: "#fff !important"
                        },
                        ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": {
                            padding: "8px",
                            color: "#fff !important"
                        },
                        ".css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
                            color: "#fff !important"
                        },
                        ".css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
                            color: "#fff !important"
                        },
                        ".css-qiwgdb": {
                            padding: "8px !important"
                        },
                        ".css-qiwgdb, .css-1636szt, .css-1yhq19e": {
                            color: "#fff !important"
                        }
                    }}>
                        <Select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            defaultValue="normal"
                        >
                            <MenuItem value="normal">{t("selectSort.unprecedented")}</MenuItem>
                            <MenuItem value="movieTitleAsc">{`${t("selectSort.name")} (A-Z)`}</MenuItem>
                            <MenuItem value="movieTitleDesc">{`${t("selectSort.name")} (Z-A)`}</MenuItem>
                            <MenuItem value="movieTimeAsc">
                                {`${t("selectSort.duration")} (${t("selectSort.low")}-${t("selectSort.high")})`}
                            </MenuItem>
                            <MenuItem value="movieTimeDesc">
                                {`${t("selectSort.duration")} (${t("selectSort.high")}-${t("selectSort.low")})`}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {isLoading ? <Box mb={12}><Box className="loading-spinner"></Box></Box> : <>
                {renderMovieList(t("homepage.nowShowing"), true, "nowShowing")}
                {renderMovieList(t("homepage.comingSoon"), false, "comingSoon")}
            </>}
        </Box>
    )
}

export default Movie