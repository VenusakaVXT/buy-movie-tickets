import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./scss/index.scss"
import { BrowserRouter } from "react-router-dom"
import "react-tooltip/dist/react-tooltip.css"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)