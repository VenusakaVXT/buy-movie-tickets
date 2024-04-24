import { useEffect, useState } from "react"
import {
    AppBar,
    Autocomplete,
    Box,
    TextField,
    Toolbar,
    Tabs,
    Tab,
    Avatar,
    Menu,
    MenuItem,
    Typography
} from "@mui/material"
import MovieIcon from "@mui/icons-material/Movie"
import LanguageMenu from "../Language/LanguageMenu"
import { getApiFromBE } from "../../api/movieApi"
import { Link, useNavigate } from "react-router-dom"
import "../../scss/Header.scss"
import { useDispatch, useSelector } from "react-redux"
import { managerActions, customerActions } from "../../store"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Tooltip } from "react-tooltip"

const Header = () => {
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const [active, setActive] = useState(0)
    const [movies, setMovies] = useState([])
    const [menuItem, setMenuItem] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    const handleMenuOpen = (e) => setMenuItem(e.currentTarget)
    const handleMenuClose = () => setMenuItem(null)

    const logout = (isAdmin) => {
        dispatch(isAdmin ? managerActions.logout() : customerActions.logout())
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

                    <Box display={"flex"}>
                        {!isCustomerLoggedIn && !isManagerLoggedIn && <>
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
                        </>}

                        {isCustomerLoggedIn && <>
                            <Link to="/cart" style={{ display: "flex", alignItems: "center", paddingRight: "16px" }}>
                                <ShoppingCartIcon
                                    sx={{ color: "#fff", ":hover": { color: "#e50914" } }}
                                    data-tooltip-content="Screening Cart"
                                    data-tooltip-id="cart"
                                />
                            </Link>

                            <Tooltip
                                id="cart"
                                place="bottom"
                                effect="solid"
                                style={{
                                    background: "rgba(37, 37, 38, 0.95)",
                                    borderRadius: "16px",
                                }}
                            />

                            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleMenuOpen}>
                                <Avatar style={{ width: "39px", height: "38px" }} alt="user avt" />
                                <Typography paddingLeft={"10px"}>{localStorage.getItem("customerName")}</Typography>
                            </Box>

                            <Menu
                                anchorEl={menuItem}
                                open={Boolean(menuItem)}
                                onClose={handleMenuClose}
                                sx={{
                                    marginTop: "12px",
                                    ".css-6hp17o-MuiList-root-MuiMenu-list": {
                                        backgroundColor: "#141212",
                                        color: "#fff"
                                    }
                                }}
                            >
                                <MenuItem sx={{ cursor: "default" }}>Account type: Customer</MenuItem>
                                <hr />

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/customer/profile")
                                    handleMenuClose()
                                }}>
                                    Account information
                                </MenuItem>

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/customer/setting")
                                    handleMenuClose()
                                }}>
                                    Settings
                                </MenuItem>
                                <hr />

                                <MenuItem LinkComponent={Link}
                                    onClick={() => {
                                        navigate("/")
                                        logout(false)
                                        handleMenuClose()
                                    }}
                                    sx={{
                                        ":hover": { color: "#e50914" }
                                    }}
                                >
                                    Log out
                                </MenuItem>
                            </Menu>
                        </>}

                        {isManagerLoggedIn && <>
                            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleMenuOpen}>
                                <Avatar style={{ width: "39px", height: "38px" }} alt="user avt" />
                                <Typography paddingLeft={"10px"}>{localStorage.getItem("managerEmail")}</Typography>
                            </Box>

                            <Menu
                                anchorEl={menuItem}
                                open={Boolean(menuItem)}
                                onClose={handleMenuClose}
                                sx={{
                                    marginTop: "12px",
                                    ".css-6hp17o-MuiList-root-MuiMenu-list": {
                                        backgroundColor: "#141212",
                                        color: "#fff"
                                    }
                                }}
                            >
                                <MenuItem sx={{ cursor: "default" }}>Account type: Manager</MenuItem>
                                <hr />

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/manager/profile")
                                    handleMenuClose()
                                }}>
                                    Account information
                                </MenuItem>

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/manager/setting")
                                    handleMenuClose()
                                }}>
                                    Settings
                                </MenuItem>
                                <hr />

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/manager/add-movie")
                                    handleMenuClose()
                                }}>
                                    Add movie
                                </MenuItem>

                                <MenuItem LinkComponent={Link} onClick={() => {
                                    navigate("/manager/mission")
                                    handleMenuClose()
                                }}>
                                    Today works
                                </MenuItem>
                                <hr />

                                <MenuItem LinkComponent={Link}
                                    onClick={() => {
                                        navigate("/")
                                        logout(true)
                                        handleMenuClose()
                                    }}
                                    sx={{
                                        ":hover": { color: "#e50914" }
                                    }}
                                >
                                    Log out
                                </MenuItem>
                            </Menu>
                        </>}
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default Header