import axios from "axios"
import { API_TIMEOUT } from "../custom/customTimeout.js"

export const getAllMovies = async () => {
    try {
        const res = await axios.get("http://localhost:5000/movie", {
            timeout: API_TIMEOUT
        })

        if (res.status === 200) {
            return res.data
        } else {
            console.log("no data...")
        }
    } catch (err) {
        // See if the problem is because the request was canceled 
        // due to a network error or timeout, or something else
        if (err.code === "ECONNABORTED") {
            console.log("Request timed out")
        } else {
            console.error(err)
        }
    }
}