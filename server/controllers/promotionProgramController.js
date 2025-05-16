import PromotionProgram from "../models/PromotionProgram.js"
import Cinema from "../models/Cinema.js"
import { isValidEndDate } from "../util/index.js"
import { isValidObjectId } from "mongoose"
import multer from "multer"
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/promotion-program")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

class PromotionProgramController {
    getPromotionPrograms = async (req, res, next) => {
        try {
            const promotionPrograms = await PromotionProgram.find().populate("cinema", "name")

            if (!promotionPrograms) {
                return res.status(500).json({ message: "request failed..." })
            }

            res.status(200).json({ promotionPrograms })
        } catch (err) {
            next(err)
        }
    }

    getPromotionProgramsByCinema = async (req, res, next) => {
        try {
            const cinemaId = req.params.cinemaId

            if (!isValidObjectId(cinemaId)) {
                return res.status(400).json({ message: "Invalid cinema id..." })
            }

            const promotionPrograms = await PromotionProgram.find({
                $and: [
                    { $or: [{ cinema: cinemaId }, { cinema: null }] },
                    { isActive: true }
                ]
            }).populate("cinema", "name")

            if (!promotionPrograms) {
                return res.status(500).json({ message: "request failed..." })
            }

            res.status(200).json({ promotionPrograms })
        } catch (err) {
            next(err)
        }
    }

    getPromotionProgramByDiscountCode = async (req, res, next) => {
        try {
            const discountCode = req.params.discountCode
            const promotionProgram = await PromotionProgram.findOne({ discountCode: discountCode.toUpperCase() })
                .populate("cinema", "name")

            if (!promotionProgram) {
                return res.status(404).json({ message: "Promotion program not found..." })
            }

            res.status(200).json({ promotionProgram })
        } catch (err) {
            next(err)
        }
    }

    getPromotionProgramById = async (req, res, next) => {
        try {
            const promotionProgram = await PromotionProgram.findById(req.params.id).populate("cinema", "name")

            if (!promotionProgram) {
                return res.status(404).json({ message: "Promotion program not found..." })
            }

            res.status(200).json({ promotionProgram })
        } catch (err) {
            next(err)
        }
    }

    create = (req, res, next) => {
        Cinema.find({})
            .then((cinemas) => res.render("promotion-program/create", { cinemas }))
            .catch(next)
    }

    store = [
        upload.single("image"),
        async (req, res, next) => {
            try {
                const {
                    discountCode,
                    programName,
                    content,
                    startDate,
                    endDate,
                    percentReduction,
                    maxMoneyAmount,
                    condition,
                    isActive,
                    cinema
                } = req.body

                if (!isValidEndDate(startDate, endDate)) {
                    return res.status(400).send("End date must be greater than start date")
                }

                const promotionData = {
                    discountCode,
                    programName,
                    content,
                    startDate,
                    endDate,
                    percentReduction,
                    maxMoneyAmount,
                    condition,
                    isActive: isActive === "on",
                    image: req.file ? `/uploads/promotion-program/${req.file.filename}` : ""
                }

                if (cinema !== "") {
                    const cinemaObj = await Cinema.findById(cinema)
                    if (!cinemaObj) {
                        return res.status(404).json({ message: "Cinema not found..." })
                    }
                    promotionData.cinema = cinemaObj._id
                } else {
                    promotionData.cinema = null
                }

                const promotionProgram = new PromotionProgram(promotionData)
                await promotionProgram.save()

                res.redirect("/promotion-program/table-lists")
            } catch (err) {
                next(err)
            }
        },
    ]

    tableLists = (req, res, next) => {
        PromotionProgram.find({}).populate("cinema", "name")
            .then((promotionPrograms) => res.render("promotion-program/read", { promotionPrograms }))
            .catch(() => next)
    }

    edit = (req, res, next) => {
        Promise.all([PromotionProgram.findOne({ _id: req.params.id }), Cinema.find({})])
            .then(([promotionProgram, cinemas]) => {
                if (!promotionProgram.cinema || !isValidObjectId(promotionProgram.cinema)) {
                    promotionProgram.cinema = ""
                }
                const imageUrl = promotionProgram.image ? `${req.protocol}://${req.get("host")}${promotionProgram.image}` : ""
                res.render("promotion-program/edit", { promotionProgram, cinemas, imageUrl })
            })
            .catch(next)
    }

    update = [
        upload.single("image"),
        async (req, res, next) => {
            try {
                const {
                    discountCode,
                    programName,
                    content,
                    startDate,
                    endDate,
                    percentReduction,
                    maxMoneyAmount,
                    condition,
                    isActive,
                    cinema
                } = req.body

                if (!isValidEndDate(startDate, endDate)) {
                    return res.status(400).send("End date must be greater than start date")
                }

                const promotionProgramId = req.params.id
                const promotionProgram = await PromotionProgram.findById(promotionProgramId)

                if (!promotionProgram) {
                    return res.status(404).json({ message: "Promotion program not found..." })
                }

                const promotionData = {
                    discountCode,
                    programName,
                    content,
                    startDate,
                    endDate,
                    percentReduction,
                    maxMoneyAmount,
                    condition,
                    isActive: isActive === "on",
                }

                if (cinema !== "") {
                    const cinemaObj = await Cinema.findById(cinema)
                    if (!cinemaObj) {
                        return res.status(404).json({ message: "Cinema not found..." })
                    }
                    promotionData.cinema = cinemaObj._id
                } else {
                    promotionData.cinema = null
                }

                if (req.file) {
                    if (promotionProgram.image) {
                        const oldImagePath = `public${promotionProgram.image}`
                        fs.unlink(oldImagePath, (err) => {
                            if (err) console.error("Error deleting old image:", err)
                        })
                    }
                    promotionData.image = `/uploads/promotion-program/${req.file.filename}`
                }

                await PromotionProgram.findByIdAndUpdate(promotionProgramId, promotionData, { new: true })
                res.redirect("/promotion-program/table-lists")
            } catch (err) {
                next(err)
            }
        },
    ]

    delete = (req, res, next) => {
        const programId = req.params.id
        PromotionProgram.findById(programId)
            .then((promotionProgram) => {
                if (!promotionProgram) {
                    return res.status(404).json({ message: "Promotion program not found..." })
                }
                if (promotionProgram.image) {
                    const imagePath = `public${promotionProgram.image}`
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error("Error deleting image:", err)
                    })
                }
                return PromotionProgram.deleteOne({ _id: programId })
            })
            .then(() => res.redirect("/promotion-program/table-lists"))
            .catch(next)
    }
}

export default new PromotionProgramController