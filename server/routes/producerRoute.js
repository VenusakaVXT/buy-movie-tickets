import express from "express"
import producerController from "../controllers/producerController.js"

const producerRouter = express.Router()

producerRouter.get("/create", producerController.create)
producerRouter.post("/store", producerController.store)
producerRouter.get("/table-lists", producerController.tableLists)
producerRouter.get("/:id/edit", producerController.edit)
producerRouter.put("/:id", producerController.update)
producerRouter.delete("/:id", producerController.delete)

export default producerRouter