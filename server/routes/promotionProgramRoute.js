import express from "express"
import promotionProgramController from "../controllers/promotionProgramController.js"

const promotionProgramRouter = express.Router()

promotionProgramRouter.get("/", promotionProgramController.getPromotionPrograms)
promotionProgramRouter.get("/create", promotionProgramController.create)
promotionProgramRouter.post("/store", promotionProgramController.store)
promotionProgramRouter.get("/table-lists", promotionProgramController.tableLists)
promotionProgramRouter.get("/:id", promotionProgramController.getPromotionProgramById)
promotionProgramRouter.get("/:id/edit", promotionProgramController.edit)
promotionProgramRouter.put("/:id", promotionProgramController.update)
promotionProgramRouter.delete("/:id", promotionProgramController.delete)

export default promotionProgramRouter