import Cinema from "../models/Cinema.js"

export const addCinema = async (req, res, next) => {
    try {
        const { name, logo } = req.body

        if (!name && name.trim() === "" && !logo && logo.trim() === "") {
            res.status(422).json({ message: "invalid inputs..." })
        }

        const newCinema = new Cinema({ name, logo })
        const savedCinema = await newCinema.save()

        res.status(201).json(savedCinema)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getAllCinema = async (req, res, next) => {
    let cinemas

    try {
        cinemas = await Cinema.find()
    } catch (err) {
        console.error(err)
    }

    if (!cinemas) {
        res.status(500).json({ message: "request failed..." })
    }

    res.status(200).json({ cinemas })
}