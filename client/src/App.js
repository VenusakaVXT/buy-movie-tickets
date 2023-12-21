import { useEffect } from "react"
import { Box } from "@mui/material"
import "./scss/App.scss"
import Header from "./components/Header/Header"
import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./components/HomePage/Home"
import Release from "./components/HomePage/Release"
import Category from "./components/HomePage/Category"
import Cinema from "./components/HomePage/Cinema"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import Footer from "./components/Footer/Footer"
import PageEnding from "./components/Footer/PageEnding"
import NotFoundPage from "./components/NotFoundPage/NotFoundPage"

const App = () => {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  // disable default scrollRestoration() of RRD
  const ScrollRestoration = () => {
    const { pathname } = useLocation()

    useEffect(() => { window.scrollTo(0, 0) }, [pathname])

    return null
  }

  return (
    <Box className="App__wrapper">
      <ScrollRestoration />
      <Header />

      <section>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/release" element={<Release />} />
          <Route path="/category" element={<Category />} />
          <Route path="/cinema" element={<Cinema />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </section>

      {isHomePage ? <Footer /> : <PageEnding />}
    </Box>
  )
}

export default App
