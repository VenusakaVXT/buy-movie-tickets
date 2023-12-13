import axios from "axios"

const getApiFromBE = async (destination) => {
    const res = await axios
        .get(`http://localhost:5000/${destination}`)
        .catch((err) => console.error(err))

    if (res.status !== 200) console.log("no data...")

    const data = await res.data
    return data
}

export default getApiFromBE