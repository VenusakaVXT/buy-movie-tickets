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
import { getBookingsFromUser } from "../../api/bookingApi"
import { getCustomerProfile, getManagerProfile } from "../../api/userApi"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../../scss/Header.scss"
import { useDispatch, useSelector } from "react-redux"
import { managerActions, customerActions } from "../../store"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StarsIcon from "@mui/icons-material/Stars"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import RuleIcon from "@mui/icons-material/Rule"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"
import BarChartIcon from "@mui/icons-material/BarChart"
import ListIcon from "@mui/icons-material/List"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import { Tooltip } from "react-tooltip"
import "../../scss/App.scss"

const Header = () => {
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const [active, setActive] = useState(0)
    const [movies, setMovies] = useState([])
    const [bookings, setBookings] = useState([])
    const [customer, setCustomer] = useState()
    const [manager, setManager] = useState()
    const [menuItem, setMenuItem] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const customerId = localStorage.getItem("customerId")
    const managerId = localStorage.getItem("managerId")

    useEffect(() => {
        if (location.pathname === "/") setActive(0)
    }, [location])

    useEffect(() => {
        getApiFromBE("movie")
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        isCustomerLoggedIn && getCustomerProfile(customerId)
            .then((res) => setCustomer(res.user))
            .catch((err) => console.error(err))
    }, [isCustomerLoggedIn, customerId])

    useEffect(() => {
        isCustomerLoggedIn && getBookingsFromUser()
            .then((res) => setBookings(res.bookings))
            .catch((err) => console.error(err))
    }, [isCustomerLoggedIn])

    useEffect(() => {
        isManagerLoggedIn && getManagerProfile(managerId)
            .then((res) => setManager(res.manager))
            .catch((err) => console.error(err))
    }, [isManagerLoggedIn, managerId])

    const handleChange = (e, val) => {
        const movie = movies.find((movie) => movie.title === val)
        if (movie) {
            navigate(`/movie-details/${movie.slug}`)
        }
    }

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

    const determinePosition = (position) => {
        switch (position) {
            case "Manage movies":
                return { path: ["add-movie", "list-movie"], menu: ["Add movie", "List movie"] }
            case "Manage screenings":
                return { path: ["add-screening", "list-screening"], menu: ["Add screening", "List screening"] }
            default:
                return { path: ["add-data", "list-data"], menu: ["Add data", "List data"] }
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
                            onChange={handleChange}
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
                            <Link to="/cart" className="header__cart">
                                <ShoppingCartIcon
                                    sx={{ color: "#fff", ":hover": { color: "#e50914" } }}
                                    data-tooltip-content="Screening Cart"
                                    data-tooltip-id="cart"
                                />

                                <span>{bookings.length.toString()}</span>
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
                                <Typography paddingLeft={"10px"}>{customer && customer.name}</Typography>
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

                                <MenuItem sx={{ cursor: "default" }}>
                                    <StarsIcon htmlColor="#ffff00" sx={{ marginRight: "2px" }} />
                                    <Typography lineHeight={"21px"}>
                                        {`Raiting: ${customer && customer.ratingPoints} point`}
                                    </Typography>
                                </MenuItem>

                                <MenuItem component={Link} to="/customer/cancel-booking/list" onClick={handleMenuClose}>
                                    <ReceiptLongIcon sx={{ marginRight: "2px" }} />List cancel booking
                                </MenuItem>

                                <MenuItem component={Link} to="/charts" onClick={handleMenuClose}>
                                    <TrendingUpIcon sx={{ marginRight: "2px" }} />Customer charts
                                </MenuItem>
                                <hr />

                                <MenuItem component={Link} to="/customer/profile" onClick={handleMenuClose}>
                                    <PersonIcon sx={{ margin: "0 2px 3px 0" }} />Account information
                                </MenuItem>

                                <MenuItem component={Link} to="/customer/setting" onClick={handleMenuClose}>
                                    <SettingsIcon sx={{ margin: "0 2px 3px 0" }} />Settings
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
                                    <LogoutIcon sx={{ marginRight: "2px" }} />Log out
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

                                <MenuItem component={Link} to="/manager/profile" onClick={handleMenuClose}>
                                    <PersonIcon sx={{ margin: "0 2px 3px 0" }} />Account information
                                </MenuItem>

                                <MenuItem component={Link} to="/manager/mission" onClick={handleMenuClose}>
                                    <RuleIcon sx={{ marginRight: "2px" }} />Today works
                                </MenuItem>
                                <hr />

                                {manager && <>
                                    <MenuItem
                                        component={Link}
                                        to={`/manager/${determinePosition(manager.position).path[0]}`}
                                        onClick={handleMenuClose}
                                    >
                                        <LibraryAddIcon sx={{ marginRight: "2px" }} />
                                        {determinePosition(manager.position).menu[0]}
                                    </MenuItem>

                                    <MenuItem
                                        component={Link}
                                        to={`/manager/${determinePosition(manager.position).path[1]}`}
                                        onClick={handleMenuClose}
                                    >
                                        <ListIcon sx={{ marginRight: "2px" }} />
                                        <Typography lineHeight={"21px"}>
                                            {determinePosition(manager.position).menu[1]}
                                        </Typography>
                                    </MenuItem>
                                </>}
                                <hr />

                                <MenuItem component={Link} to="/manager/cancel-booking/list" onClick={handleMenuClose}>
                                    <ReceiptLongIcon sx={{ marginRight: "2px" }} />List cancel booking
                                </MenuItem>

                                <MenuItem component={Link} to="/manager/statistical" onClick={handleMenuClose}>
                                    <BarChartIcon sx={{ marginRight: "2px" }} />
                                    <Typography lineHeight={"21px"}>Statistical</Typography>
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
                                    <LogoutIcon sx={{ marginRight: "2px" }} />Log out
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