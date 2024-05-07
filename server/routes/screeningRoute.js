import express from "express"
import screeningController from "../controllers/screeningController.js"

const screeningRouter = express.Router()

screeningRouter.get("/", screeningController.getApiScreening)
screeningRouter.get("/create", screeningController.create)
screeningRouter.post("/store", screeningController.store)
screeningRouter.get("/now-showing", screeningController.lstNowShowing)
screeningRouter.get("/:id/edit", screeningController.edit)
screeningRouter.put("/:id", screeningController.update)
screeningRouter.delete("/:id", screeningController.delete)
screeningRouter.get("/comming-soon", screeningController.lstCommingSoon)

export default screeningRouter