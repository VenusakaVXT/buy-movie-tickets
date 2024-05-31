import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import "./scss/App.scss"
import { Routes, Route, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { customerActions, managerActions } from "./store"
import { getManagerProfile } from "./api/userApi"
import Header from "./components/Header/Header"
import Home from "./components/HomePage/Home"
import Release from "./components/HomePage/Release"
import Category from "./components/HomePage/Category"
import Cinema from "./components/HomePage/Cinema"
import Register from "./components/Auth/Register"
import CustomerLogin from "./components/Auth/CustomerLogin"
import ManagerLogin from "./components/Auth/ManagerLogin"
import Footer from "./components/Footer/Footer"
import PageEnding from "./components/Footer/PageEnding"
import NotFoundPage from "./components/NotFoundPage/NotFoundPage"
import GoToTopButton from "./components/GoToTop/GoToTopButton"
import Movie from "./components/Movie/Movie"
import MovieDetail from "./components/Movie/MovieDetail"
import Booking from "./components/Booking/Booking"
import SeatDiagram from "./components/Booking/SeatDiagram"
import CinemaTicket from "./components/Booking/CinemaTicket"
import Cart from "./components/Cart/Cart"
import Profile from "./components/User/Profile"
import AddMovie from "./components/Manager/AddMovie"
import AddScreening from "./components/Manager/AddScreening"
import ListData from "./components/Manager/ListData"
import Statistical from "./components/Manager/Statistical"
import Charts from "./components/Charts/Charts"

const formatTitle = (pathname) => {
    const convertPathname = pathname.replace(/\//g, " ").replace(/-/g, " ").trim()
    return convertPathname.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

const App = () => {
    const [manager, setManager] = useState()
    const dispatch = useDispatch()
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const location = useLocation()
    const isHomePage = location.pathname === "/"
    const title = "Buy Movie Tickets"

    console.log("isManagerLoggedIn", isManagerLoggedIn)
    console.log("isCustomerLoggedIn", isCustomerLoggedIn)

    useEffect(() => {
        if (localStorage.getItem("customerId")) {
            dispatch(customerActions.login())
        } else if (localStorage.getItem("managerId")) {
            dispatch(managerActions.login())
        } else {
            console.log("Not logged in yet...")
        }
    }, [dispatch])

    useEffect(() => {
        getManagerProfile(localStorage.getItem("managerId"))
            .then((res) => setManager(res.manager))
            .catch((err) => console.error(err))
    }, [])

    const handlePathAndTitle = (type) => {
        const str = manager && manager.position === "Manage movies" ? "Movie" : "Screening"
        return type === "lower" ? str.toLowerCase() : str
    }

    // disable default scrollRestoration() of RRD
    const ScrollRestoration = () => {
        const { pathname } = useLocation()

        useEffect(() => window.scrollTo(0, 0), [pathname])

        return null
    }

    return (
        <Box className="App__wrapper">
            <Helmet>
                <title>{isHomePage ? `${title}` : `${title} | ${formatTitle(location.pathname)}`}</title>
            </Helmet>

            <ScrollRestoration />
            <Header />

            <section>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/release" element={<Release />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/cinema" element={<Cinema />} />
                    <Route path="/all-movies" element={<Movie />} />
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/manager/login" element={<ManagerLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movie-details/:slug" element={<MovieDetail />} />
                    <Route path="/booking/:slug" element={<Booking />} />
                    <Route path="/booking/:movieSlug/:screeningId" element={
                        <SeatDiagram title={`${title} | Seat Diagram`} />
                    } />
                    <Route path="/booking/:bookingId/detail" element={
                        <CinemaTicket title={`${title} | Movie Ticket`} />
                    } />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                        path={`${isCustomerLoggedIn ? "/customer" : "/manager"}/profile`}
                        element={<Profile />}
                    />
                    <Route path="/manager/add-movie" element={
                        <AddMovie title={`${title} | Add Movie`} />
                    } />
                    <Route path="/manager/add-screening" element={
                        <AddScreening title={`${title} | Add Screening`} />
                    } />
                    <Route path={`/manager/list-${handlePathAndTitle("lower")}`} element={
                        <ListData title={`${title} | List ${handlePathAndTitle("upper")}`} />
                    } />
                    <Route path="/manager/statistical" element={
                        <Statistical title={`${title} | Statistical`} />
                    } />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </section>

            {isHomePage ? <Footer /> : <PageEnding />}

            <GoToTopButton />
        </Box>
    )
}

export default App