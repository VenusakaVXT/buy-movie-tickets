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

export const getAllCategories = async () => {
    const res = await axios
        .get("http://localhost:5000/category")
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const data = await res.data
    return data
}