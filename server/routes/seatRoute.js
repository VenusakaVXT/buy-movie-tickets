import express from "express"
import seatController from "../controllers/seatController.js"

const seatRouter = express.Router()

seatRouter.get("/", seatController.getApiSeat)
seatRouter.get("/create", seatController.create)
seatRouter.post("/store", seatController.store)
seatRouter.get("/table-lists", seatController.tableLists)
seatRouter.get("/:id/edit", seatController.edit)
seatRouter.put("/:id", seatController.update)
seatRouter.delete("/:id", seatController.delete)

export default seatRouter