import { useEffect } from "react"
import { Box } from "@mui/material"
import "./scss/App.scss"
import Header from "./components/Header/Header"
import { Routes, Route, useLocation } from "react-router-dom"
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
import { Helmet } from "react-helmet"
import { useDispatch, useSelector } from "react-redux"
import { customerActions, managerActions } from "./store"
import MovieDetail from "./components/Movie/MovieDetail"

const formatTitle = (pathname) => {
    const convertPathname = pathname.replace(/\//g, " ").replace(/-/g, " ").trim()
    return convertPathname.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

const App = () => {
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
                    <Route path="/all-screening" element={<Movie />} />
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/manager/login" element={<ManagerLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movie-details/:slug" element={<MovieDetail />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </section>

            {isHomePage ? <Footer /> : <PageEnding />}

            <GoToTopButton />
        </Box>
    )
}

export default App