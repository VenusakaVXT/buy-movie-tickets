import { useEffect, useState } from "react"
import {
    AppBar,
    Autocomplete,
    Box,
    TextField,
    Toolbar,
    Tabs,
    Tab,
} from "@mui/material"
import MovieIcon from "@mui/icons-material/Movie"
import LanguageMenu from "../Language/LanguageMenu"
import { getApiFromBE } from "../../api/movieApi"
import { Link } from "react-router-dom"
import "../../scss/Header.scss"

const Header = () => {
    const [active, setActive] = useState(0)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    const handleTabClick = (e) => {
        const getIdByTab = e.currentTarget.getAttribute("data-id")

        if (getIdByTab) {
            const element = document.getElementById(getIdByTab)

            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        }
    }

    const highlightOption = (option, inputVal) => {
        const regex = new RegExp(`(${inputVal})`, "gi")

        if (!inputVal) {
            return <span>{option}</span>
        } else {
            // Word breaking skill: Keep space between words
            return option.split(regex).map((query, index) =>
                regex.test(query) ? (
                    <span key={index} style={{ color: "#ff0000" }}>{query}</span>
                ) : (query)
            )
        }
    }

    return (
        <AppBar position="sticky" className="header" sx={{ bgcolor: "#000" }}>
            <Toolbar className="header__wrapper">
                <div className="header__container">
                    <Link
                        className="header__brand-wrapper"
                        to="/"
                        onClick={() => setActive(0)}
                    >
                        <MovieIcon className="header__brand-icon" />
                        <p className="header__brand-name">Buy Movie Tickets</p>
                    </Link>

                    <Box>
                        <Tabs
                            className="header__navbar"
                            textColor="#fff"
                            TabIndicatorProps={{
                                style: { background: "#e50914" },
                            }}
                            value={active}
                            onChange={(e, val) => setActive(val)}
                        >
                            <Tab
                                className="header__navitem"
                                label="Home"
                                data-id="home"
                                onClick={handleTabClick}
                            />
                            <Tab
                                className="header__navitem"
                                label="Release"
                                data-id="release"
                                onClick={handleTabClick}
                            />
                            <Tab
                                className="header__navitem"
                                label="Category"
                                data-id="category"
                                onClick={handleTabClick}
                            />
                            <Tab
                                className="header__navitem"
                                label="Cinema"
                                data-id="cinema"
                                onClick={handleTabClick}
                            />
                        </Tabs>
                    </Box>
                </div>

                <div className="header__container">
                    <Box className="header__search">
                        <Autocomplete
                            freeSolo
                            options={
                                movies && movies.map((option) => option.title)
                            }
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField
                                    variant="standard"
                                    {...params}
                                    label="Search for movies..."
                                />
                            )}
                            renderOption={(props, option, { inputValue }) => (
                                <li
                                    {...props}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        whiteSpace: "nowrap"
                                    }}>
                                    {highlightOption(option, inputValue)}
                                </li>
                            )}
                        />
                    </Box>

                    <LanguageMenu />

                    <Box>
                        <Tabs className="header__option" textColor="#fff">
                            <Tab
                                className="header__option-item"
                                label="Customer"
                                LinkComponent={Link}
                                to="/customer/login"
                            />
                            <Tab
                                className="header__option-item"
                                label="Manager"
                                LinkComponent={Link}
                                to="/manager/login"
                            />
                        </Tabs>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header
