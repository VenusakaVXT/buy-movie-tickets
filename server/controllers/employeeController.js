import Employee from "../models/Employee.js"
import Cinema from "../models/Cinema.js"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcrypt"
import { io } from "../index.js"

const hashEmployeePassword = (employeePassword) => {
    return bcrypt.hashSync(employeePassword, bcrypt.genSaltSync(10))
}

class EmployeeController {
    create(req, res, next) {
        Cinema.find({})
            .then((cinemas) => res.render("employee/create", { cinemas }))
            .catch(next)
    }

    store = async (req, res, next) => {
        const { email, password, position } = req.body
        const cinemaObj = await Cinema.findOne({ _id: req.body.cinema })
        const hashPassword = hashEmployeePassword(password)

        const employee = new Employee({
            email,
            password: hashPassword,
            position,
            cinema: cinemaObj._id
        })

        await employee.save()
            .then(async () => {
                cinemaObj.employees.push(employee._id)
                await cinemaObj.save()
                res.redirect("/employee/table-lists")
            })
            .catch(next)
    }

    tableLists = async (req, res, next) => {
        try {
            const employees = await Employee.find({})
            const cinemas = await Cinema.find({})

            employees.forEach((employee) => {
                const cinema = cinemas.find((c) =>
                    c._id.toString() === employee.cinema.toString()
                )
                employee.cinemaName = cinema ? cinema.name : "Unknown"
            })

            res.render("employee/read", { employees })
        }
        catch (err) {
            next(err)
        }
    }

    edit(req, res, next) {
        Promise.all([Cinema.find({}), Employee.findById(req.params.id)])
            .then(([cinemas, employee]) => {
                if (!employee.cinema || !isValidObjectId(employee.cinema)) {
                    employee.cinema = ""
                }
                res.render("cinema/edit", { cinemas, employee })
            })
            .catch(next)
    }

    update(req, res, next) {
        Cinema.findById({ _id: req.body.cinema })
            .then((cinema) => {
                const employeeId = req.params.id

                Employee.updateOne({ _id: employeeId }, {
                    email: req.body.email,
                    password: req.body.password,
                    position: req.body.position,
                    cinema: cinema._id
                })
                    .then(() => {
                        const foundEmployee = cinema.employees.indexOf(employeeId)

                        if (foundEmployee == -1) {
                            cinema.employees.push(employeeId)
                            cinema.save()
                        }

                        res.redirect("/employee/table-lists")
                    })
                    .catch(next)
            })
            .catch(next)
    }

    delete(req, res, next) {
        Employee.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/employee/table-lists"))
            .catch(next)
    }

    lockAccount = (req, res, next) => {
        Employee.findById(req.params.id)
            .then((employee) => {
                employee.locked = true
                return employee.save()
            })
            .then((employee) => {
                io.emit("accountLocked", { id: employee._id })
                res.json({ success: true })
            })
            .catch(next)
    }

    unlockAccount = (req, res, next) => {
        Employee.findById(req.params.id)
            .then((employee) => {
                employee.locked = false
                return employee.save()
            })
            .then((employee) => {
                io.emit("accountUnlocked", { id: employee._id })
                res.json({ success: true })
            })
            .catch(next)
    }
}

export default new EmployeeController