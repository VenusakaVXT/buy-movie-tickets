import express from "express"
import employeeController from "../controllers/employeeController.js"

const employeeRouter = express.Router()

employeeRouter.get("/create", employeeController.create)
employeeRouter.post("/store", employeeController.store)
employeeRouter.get("/table-lists", employeeController.tableLists)
employeeRouter.get("/:id/edit", employeeController.edit)
employeeRouter.put("/:id", employeeController.update)
employeeRouter.delete("/:id", employeeController.delete)
employeeRouter.patch("/:id/lock", employeeController.lockAccount)
employeeRouter.patch("/:id/unlock", employeeController.unlockAccount)

export default employeeRouter