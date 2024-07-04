import express from "express"
import screeningController from "../controllers/screeningController.js"

const screeningRouter = express.Router()

screeningRouter.get("/", screeningController.getApiScreening)
screeningRouter.post("/", screeningController.addScreening)
screeningRouter.get("/create", screeningController.create)
screeningRouter.post("/store", screeningController.store)
screeningRouter.get("/now-showing", screeningController.lstNowShowing)
screeningRouter.get("/:id/edit", screeningController.edit)
screeningRouter.put("/:id", screeningController.update)
screeningRouter.delete("/:id", screeningController.delete)
screeningRouter.get("/comming-soon", screeningController.lstCommingSoon)
screeningRouter.get("/:id/cinema-room/all-seats", screeningController.getAllSeatsFromCinemaRoom)
screeningRouter.get("/dates", screeningController.getCurrentDateAnd8DaysLater)
screeningRouter.get("/:movieSlug/:movieDate", screeningController.getScreeningsByDate)
screeningRouter.get("/:movieSlug/cinema/:cinemaId", screeningController.getScreeningsByCinema)
screeningRouter.get("/:movieSlug/:movieDate/:cinemaId", screeningController.getScreeningsByCinemaAndDate)

export default screeningRouter