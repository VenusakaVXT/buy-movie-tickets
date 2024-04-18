import Employee from "../models/Employee.js"
import Cinema from "../models/Cinema.js"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcrypt"

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
                Employee.updateOne({ _id: req.params.id }, {
                    email: req.body.email,
                    password: req.body.password,
                    position: req.body.position,
                    cinema: cinema._id
                })
                    .then(() => res.redirect("/employee/table-lists"))
                    .catch(next)
            })
            .catch(next)
    }

    delete(req, res, next) {
        Employee.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("/employee/table-lists"))
            .catch(next)
    }
}

export default new EmployeeController