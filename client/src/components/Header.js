import { useState } from "react"
import "../scss/Header.scss"
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
import LanguageMenu from "./LanguageMenu"

const movieList = ["Loki s2", "The Marvels", "Aquaman an Lost Kingdom"]

function Header() {
    const [active, setActive] = useState(0)

    return (
        <AppBar className="header" sx={{ bgcolor: "#000" }}>
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
                            <Tab className="header__navitem" label="Home" />
                            <Tab className="header__navitem" label="Release" />
                            <Tab className="header__navitem" label="Category" />
                            <Tab className="header__navitem" label="Cinema" />
                        </Tabs>
                    </Box>
                </div>

                <div className="header__container">
                    <Box className="header__search">
                        <Autocomplete
                            freeSolo
                            options={movieList.map((option) => option)}
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
                            <Tab className="header__option-item" label="Sign up" />
                            <Tab className="header__option-item" label="Login" />
                        </Tabs>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header