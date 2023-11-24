import axios from "axios"

export const getAllMovies = async () => {
    try {
        const res = await axios.get("http://localhost:5000/movie")

        if (res.status === 200) {
            const data = await res.data
            return data
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