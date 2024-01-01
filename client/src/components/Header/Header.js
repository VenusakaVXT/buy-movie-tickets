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
import getApiFromBE from "../../api/movieApi"
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
                            renderInput={(params) => (
                                <TextField
                                    variant="standard"
                                    {...params}
                                    label="Search for movies..."
                                />
                            )}
                        />
                    </Box>

                    <LanguageMenu />

                    <Box>
                        <Tabs className="header__option" textColor="#fff">
                            <Tab
                                className="header__option-item"
                                label="Sign up"
                                LinkComponent={Link}
                                to="/register"
                            />
                            <Tab
                                className="header__option-item"
                                label="Login"
                                LinkComponent={Link}
                                to="/login"
                            />
                        </Tabs>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header
