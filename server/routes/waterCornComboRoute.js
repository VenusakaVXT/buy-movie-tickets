import express from "express"
import waterCornComboController from "../controllers/waterCornComboController.js"

const waterCornComboRouter = express.Router()

waterCornComboRouter.get("/create", waterCornComboController.create)
waterCornComboRouter.post("/store", waterCornComboController.store)
waterCornComboRouter.get("/table-lists", waterCornComboController.tableLists)
waterCornComboRouter.get("/:id/edit", waterCornComboController.edit)
waterCornComboRouter.put("/:id", waterCornComboController.update)
waterCornComboRouter.delete("/:id", waterCornComboController.delete)

export default waterCornComboRouter