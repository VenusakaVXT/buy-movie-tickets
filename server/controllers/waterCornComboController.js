import WaterCornCombo from "../models/WaterCornCombo.js"
import Cinema from "../models/Cinema.js"
import { isValidObjectId } from "mongoose"
import multer from "multer"
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/water-corn-combo")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

class WaterCornComboController {
    create = (req, res, next) => {
        Cinema.find({})
            .then((cinemas) => res.render("water-corn-combo/create", { cinemas }))
            .catch(next)
    }

    store = [
        upload.single("image"),
        async (req, res, next) => {
            try {
                const { comboName, components, price, cinema } = req.body
                const cinemaObj = await Cinema.findOne({ _id: cinema })

                if (!cinemaObj) {
                    return res.status(404).json({ message: "Cinema not found..." })
                }

                const waterCornCombo = new WaterCornCombo({
                    comboName,
                    image: req.file ? `/uploads/water-corn-combo/${req.file.filename}` : "",
                    components,
                    price,
                    cinema: cinemaObj._id,
                })

                await waterCornCombo.save()
                res.redirect("/water-corn-combo/table-lists")
            } catch (err) {
                next(err)
            }
        },
    ]

    tableLists = (req, res, next) => {
        WaterCornCombo.find({}).populate("cinema", "name")
            .then((waterCornCombos) => res.render("water-corn-combo/read", { waterCornCombos }))
            .catch(next)
    }

    edit = (req, res, next) => {
        Promise.all([WaterCornCombo.findOne({ _id: req.params.id }), Cinema.find({})])
            .then(([waterCornCombo, cinemas]) => {
                if (!waterCornCombo.cinema || !isValidObjectId(waterCornCombo.cinema)) {
                    waterCornCombo.cinema = ""
                }
                const imageUrl = waterCornCombo.image ? `${req.protocol}://${req.get("host")}${waterCornCombo.image}` : ""
                res.render("water-corn-combo/edit", { waterCornCombo, cinemas, imageUrl })
            })
            .catch(next)
    }

    update = [
        upload.single("image"),
        async (req, res, next) => {
            try {
                const { comboName, components, price, cinema } = req.body
                const comboId = req.params.id
                const waterCornCombo = await WaterCornCombo.findById(comboId)
                const cinemaObj = await Cinema.findById(cinema)

                if (!waterCornCombo) {
                    return res.status(404).json({ message: "Water corn combo not found..." })
                }

                if (!cinemaObj) {
                    return res.status(404).json({ message: "Cinema not found..." })
                }

                const updatedData = {
                    comboName,
                    components,
                    price,
                    cinema: cinemaObj._id,
                }

                if (req.file) {
                    if (waterCornCombo.image) {
                        const oldImagePath = `public${waterCornCombo.image}`
                        fs.unlink(oldImagePath, (err) => {
                            if (err) console.error("Error deleting old image:", err)
                        })
                    }
                    updatedData.image = `/uploads/water-corn-combo/${req.file.filename}`
                }

                await WaterCornCombo.findByIdAndUpdate(comboId, updatedData, { new: true })
                res.redirect("/water-corn-combo/table-lists")
            } catch (err) {
                next(err)
            }
        },
    ]

    delete = (req, res, next) => {
        const comboId = req.params.id
        WaterCornCombo.findById(comboId)
            .then((waterCornCombo) => {
                if (!waterCornCombo) {
                    return res.status(404).json({ message: "Water corn combo not found..." })
                }
                if (waterCornCombo.image) {
                    const imagePath = `public${waterCornCombo.image}`
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error("Error deleting image:", err)
                    })
                }
                return WaterCornCombo.deleteOne({ _id: comboId })
            })
            .then(() => res.redirect("/water-corn-combo/table-lists"))
            .catch(next)
    }
}

export default new WaterCornComboController