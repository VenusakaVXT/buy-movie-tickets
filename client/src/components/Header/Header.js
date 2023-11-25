import { useEffect, useState } from "react"
import "../../scss/Header.scss"
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
import { getAllMovies } from "../../api/movieApi"
import { Link } from "react-router-dom"

const Header = () => {
    const [active, setActive] = useState(0)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    return (
        <AppBar position="sticky" className="header" sx={{ bgcolor: "#000" }}>
            <Toolbar className="header__wrapper">
                <div className="header__container">
                    <Box className="header__brand-wrapper">
                        <MovieIcon className="header__brand-icon" />
                        <p className="header__brand-name">Buy Movie Tickets</p>
                    </Box>

                    <Box>
                        <Tabs
                            className="header__navbar"
                            textColor="#fff"
                            TabIndicatorProps={{ style: { background: "#e50914" } }}
                            value={active}
                            onChange={(e, val) => setActive(val)}
                        >
                            <Tab
                                className="header__navitem"
                                label="Home"
                                LinkComponent={Link}
                                to="/"
                            />
                            <Tab
                                className="header__navitem"
                                label="Release"
                                LinkComponent={Link}
                                to="/release"
                            />
                            <Tab
                                className="header__navitem"
                                label="Category"
                                LinkComponent={Link}
                                to="/category"
                            />
                            <Tab
                                className="header__navitem"
                                label="Cinema"
                                LinkComponent={Link}
                                to="/cinema"
                            />
                        </Tabs>
                    </Box>
                </div>

                <div className="header__container">
                    <Box className="header__search">
                        <Autocomplete
                            freeSolo
                            options={movies && movies.map((option) => option.title)}
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