import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./scss/index.scss"
import { BrowserRouter } from "react-router-dom"
import "react-tooltip/dist/react-tooltip.css"
import axios from "axios"
import { Provider } from "react-redux"
import { store } from "./store"
import i18n from "./util/i18n"

axios.defaults.baseURL = process.env.REACT_APP_API_URL
console.log("Default language:", i18n.language)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)