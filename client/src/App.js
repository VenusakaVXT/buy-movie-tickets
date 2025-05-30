import { useEffect, Suspense } from "react"
import { Box } from "@mui/material"
import "./scss/App.scss"
import { Routes, Route, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { customerActions, managerActions } from "./store"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./components/Header/Header"
import Home from "./components/HomePage/Home"
import Release from "./components/HomePage/Release"
import Category from "./components/HomePage/Category"
import Cinema from "./components/HomePage/Cinema"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
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
import CancelBooking from "./components/CancelBooking/CancelBooking"
import ListCancelBooking from "./components/CancelBooking/ListCancelBooking"
import CancelBookingInfo from "./components/CancelBooking/CancelBookingInfo"
import Loading from "./components/Loading/Loading"
import ForgotPassword from "./components/Login/ForgotPassword"
import PromotionProgram from "./components/PromotionProgram/PromotionProgram"
import ChatBoxButton from "./components/ChatBox/ChatBoxButton"
import ChatBox from "./components/ChatBox/ChatBox"

const convertTitle = (pathname) => {
    const convertPathname = pathname.replace(/\//g, " ").replace(/-/g, " ").trim()
    return convertPathname.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

const title = "Buy Movie Tickets"
export const formatTitle = (pathname) => `${title} | ${pathname}`
export const socket = io(process.env.REACT_APP_API_URL)

const App = () => {
    const dispatch = useDispatch()
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const customerId = useSelector((state) => state.customer.id)
    const customerName = useSelector((state) => state.customer.name)
    const bookings = useSelector((state) => state.customer.bookings)
    const ratingPoints = useSelector((state) => state.customer.ratingPoints)
    const managerId = useSelector((state) => state.manager.id)
    const decision = isCustomerLoggedIn && !isManagerLoggedIn ? "customer" : "manager"
    const location = useLocation()
    const isHomePage = location.pathname === "/"

    console.log("isManagerLoggedIn", isManagerLoggedIn)
    console.log("isCustomerLoggedIn", isCustomerLoggedIn)

    useEffect(() => {
        if (isManagerLoggedIn) {
            socket.on("accountLocked", ({ id }) => {
                socket.emit("employeeLogout", { id: managerId })
                if (id === localStorage.getItem("managerId")) {
                    alert("This account will be logged out because it has been disabled by the BMT system.")
                    dispatch(managerActions.logout())
                }
            })
        }

        return () => { socket.off("accountLocked") }
    }, [isManagerLoggedIn, managerId, dispatch])

    useEffect(() => {
        if (localStorage.getItem("customerId")) {
            dispatch(customerActions.login({
                id: customerId,
                name: customerName,
                bookings,
                ratingPoints
            }))
        } else if (localStorage.getItem("managerId")) {
            dispatch(managerActions.login({ id: managerId }))
            socket.emit("employeeLogin", { id: managerId })
        } else {
            console.log("Not logged in yet...")
        }
    }, [dispatch, customerId, customerName, bookings, ratingPoints, managerId])

    // disable default scrollRestoration() of RRD
    const ScrollRestoration = () => {
        const { pathname } = useLocation()

        useEffect(() => window.scrollTo(0, 0), [pathname])

        return null
    }

    return (
        <Suspense fallback={<Loading />}>
            <Box className="App__wrapper">
                <Helmet>
                    <title>{isHomePage ? title : formatTitle(convertTitle(location.pathname))}</title>
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
                        <Route path="/movie-details/:slug" element={<MovieDetail />} />
                        <Route path="/booking/:slug" element={<Booking />} />
                        <Route path="/booking/:movieSlug/:screeningId" element={<SeatDiagram />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/promotion-program/:discountCode" element={<PromotionProgram />} />
                        {(!isCustomerLoggedIn && !isManagerLoggedIn) && <>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/login/forgot-password" element={<ForgotPassword />} />
                        </>}
                        {isCustomerLoggedIn && <>
                            <Route path="/booking/:bookingId/detail" element={<CinemaTicket />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path={"/customer/cancel-booking/:bookingId"} element={<CancelBooking />} />
                        </>}
                        {isManagerLoggedIn && <>
                            <Route path="/manager/add-movie" element={<AddMovie />} />
                            <Route path="/manager/add-screening" element={<AddScreening />} />
                            <Route path={`/manager/list-movie`} element={<ListData />} />
                            <Route path={`/manager/list-screening`} element={<ListData />} />
                            <Route path="/manager/statistical" element={<Statistical />} />
                        </>}
                        {(isCustomerLoggedIn || isManagerLoggedIn) && <>
                            <Route path={`/${decision}/profile`} element={<Profile />} />
                            <Route path={`/${decision}/cancel-booking/list`} element={<ListCancelBooking />} />
                            <Route path={`/${decision}/cancel-booking/:id/detail`} element={<CancelBookingInfo />} />
                            <Route path={`/chat`} element={<ChatBox
                                userId={isCustomerLoggedIn ? localStorage.getItem("customerId") : localStorage.getItem("managerId")}
                                userType={decision}
                            />} />
                        </>}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </section>

                {isHomePage ? <Footer /> : <PageEnding />}

                {location.pathname !== "/chat" && <ChatBoxButton />}
                <GoToTopButton />

                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Box>
        </Suspense>
    )
}

export default App