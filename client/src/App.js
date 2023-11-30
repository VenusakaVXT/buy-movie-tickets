import { Box } from "@mui/material"
import "./scss/App.scss"
import Header from "./components/Header/Header"
import { Routes, Route } from "react-router-dom"
import Home from "./components/HomePage/Home"
import Release from "./components/HomePage/Release"
import Category from "./components/HomePage/Category"
import Cinema from "./components/HomePage/Cinema"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import NotFoundPage from "./components/NotFoundPage/NotFoundPage"

const App = () => {
  return (
    <Box className="App__wrapper">
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
    </Box>
  )
}

export default App
