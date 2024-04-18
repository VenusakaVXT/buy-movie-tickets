import express from "express"
import screeningController from "../controllers/screeningController.js"

const screeningRouter = express.Router()

screeningRouter.get("/", screeningController.getApiScreening)
screeningRouter.get("/create", screeningController.create)
screeningRouter.post("/store", screeningController.store)
screeningRouter.get("/table-lists", screeningController.tableLists)
screeningRouter.get("/:id/edit", screeningController.edit)
screeningRouter.put("/:id", screeningController.update)
screeningRouter.delete("/:id", screeningController.delete)
screeningRouter.get("/discontinued-release", screeningController.screeningDiscontinued)

export default screeningRouter