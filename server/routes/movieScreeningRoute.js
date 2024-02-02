import express from "express"
import movieScreeningController from "../controllers/movieScreeningController.js"

const movieScreeningRouter = express.Router()

// Form action routing
movieScreeningRouter.post("/handle-delete-action-form", movieScreeningController.handleDeleteActionFrm)
movieScreeningRouter.post("/handle-restore-action-form", movieScreeningController.handleRestoreActionFrm)

// Functional routing
movieScreeningRouter.get("/create", movieScreeningController.create)
movieScreeningRouter.post("/store", movieScreeningController.store)
movieScreeningRouter.get("/table-lists", movieScreeningController.tableLists)
movieScreeningRouter.get("/:id/edit", movieScreeningController.edit)
movieScreeningRouter.put("/:id", movieScreeningController.update)
movieScreeningRouter.delete("/:id", movieScreeningController.delete)
movieScreeningRouter.get("/trash-can", movieScreeningController.recycleBin)
movieScreeningRouter.patch("/:id/restore", movieScreeningController.restore)
movieScreeningRouter.delete("/:id/force-delete", movieScreeningController.forceDelete)
movieScreeningRouter.get("/:slug/detail", movieScreeningController.detail)

export default movieScreeningRouter
