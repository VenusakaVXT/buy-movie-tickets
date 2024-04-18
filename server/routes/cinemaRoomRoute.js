import express from "express"
import cinemaRoomController from "../controllers/cinemaRoomController.js"

const cinemaRoomRouter = express.Router()

cinemaRoomRouter.get("/create", cinemaRoomController.create)
cinemaRoomRouter.post("/store", cinemaRoomController.store)
cinemaRoomRouter.get("/table-lists", cinemaRoomController.tableLists)
cinemaRoomRouter.get("/:id/edit", cinemaRoomController.edit)
cinemaRoomRouter.put("/:id", cinemaRoomController.update)
cinemaRoomRouter.delete("/:id", cinemaRoomController.delete)

export default cinemaRoomRouter