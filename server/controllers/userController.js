import bcrypt from "bcrypt"
import User from "../models/User.js"
import Booking from "../models/Booking.js"
import Comment from "../models/Comment.js"
import CancelBooking from "../models/CancelBooking.js"

const salt = bcrypt.genSaltSync(10) // saltRounds: 10

const hashUserPassword = (userPassword) => {
    return bcrypt.hashSync(userPassword, salt)
}

export const getAllUsers = async (req, res, next) => {
    let users

    try {
        users = await User.find()
    } catch (err) {
        console.error(err)
    }

    if (!users) {
        return res.status(500).json({
            message: "Unexpected Error Occurred!!!",
        })
    }

    return res.status(200).json({ users })
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(500).json({ message: "user not found..." })
        }

        return res.status(200).json({ user })
    } catch (err) {
        next(err)
    }
}

export const register = async (req, res, next) => {
    const { name, phone, email, password, birthDay, gender, address } = req.body

    const hashPassword = hashUserPassword(password)

    if (
        (!name || name.trim() === "") &&
        (!phone || phone.trim() === "") &&
        (!email || email.trim() === "") &&
        (!password || password.trim() === "")
    ) {
        return res.status(422).json({
            message: "Invalid inputs...",
        })
    }

    let user

    try {
        user = new User({
            name,
            phone,
            email,
            password: hashPassword,
            birthDay,
            gender,
            address,
            ratingPoints: 0
        })
        user = await user.save()
    } catch (err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Unexpected Error Occurred!!!",
        })
    }

    return res.status(201).json({ user, message: "Register successfully..." })
}

export const updateUser = async (req, res, next) => {
    const id = req.params.id

    const { name, phone, email, birthDay, gender, address } = req.body

    if (
        (!name || name.trim() === "") &&
        (!phone || phone.trim() === "") &&
        (!email || email.trim() === "")
    ) {
        return res.status(422).json({
            message: "Invalid inputs...",
        })
    }

    let user

    try {
        user = await User.findByIdAndUpdate(id, {
            name,
            phone,
            email,
            birthDay,
            gender,
            address,
        })
    } catch (err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Something went wrong...",
        })
    }

    res.status(200).json({ message: "User update successfully!!!" })
}

export const deleteUser = async (req, res, next) => {
    const id = req.params.id

    let user

    try {
        user = await User.findByIdAndRemove(id)
    } catch (err) {
        console.error(err)
    }

    if (!user) {
        return res.status(500).json({
            message: "Something went wrong...",
        })
    }

    res.status(200).json({ message: "User delete successfully!!!" })
}

export const login = async (req, res, next) => {
    const { nameAccount, password } = req.body

    if (
        !nameAccount &&
        nameAccount.trim() === "" &&
        !password &&
        password.trim() === ""
    ) {
        return res.status(422).json({
            message: "Invalid inputs...",
        })
    }

    let existUser

    try {
        existUser = await User.findOne({
            $or: [{ email: nameAccount }, { phone: nameAccount }],
        })
    } catch (err) {
        console.error(err)
    }

    if (!existUser) {
        return res.status(404).json({ message: "User not found..." })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existUser.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password..." })
    }

    res.status(200).json({
        message: "Login successfully!!!",
        id: existUser._id,
        name: existUser.name,
        bookings: existUser.bookings,
        ratingPoints: existUser.ratingPoints
    })
}

export const getBookingOfUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate("bookings")

        if (!user) {
            return res.status(404).json({ message: "user not found..." })
        }

        const bookings = await Booking.find({ _id: { $in: user.bookings } })
            .populate("seats", "rowSeat seatNumber")
            .populate({
                path: "screening",
                select: "movieDate",
                options: { withDeleted: true },
                populate: {
                    path: "movie",
                    options: { withDeleted: true },
                    select: "title trailerId slug"
                }
            })
            .sort({ createdAt: -1 })

        if (!bookings) {
            return res.status(500).json({ message: "unable to get booking..." })
        }

        return res.status(200).json({ bookings })
    } catch (err) {
        console.error(err)
    }
}

export const getCustomersRanking = async (req, res, next) => {
    try {
        const customers = await User.find().lean()

        const customersData = customers.map((customer) => ({
            name: customer.name,
            totalBookings: customer.bookings.length,
            feedbacks: customer.comments.length,
            ratingPoints: customer.ratingPoints,
            isOnline: customer.isOnline
        }))

        customersData.sort((a, b) => b.ratingPoints - a.ratingPoints)

        const topCustomers = customersData.slice(0, 10)

        topCustomers.forEach((customer, index) => {
            customer.rank = index + 1
        })

        return res.status(200).json({ customersStatistics: topCustomers })
    } catch (err) {
        next(err)
    }
}

export const userComment = async (req, res, next) => {
    try {
        const { userId, movieId, content } = req.body
        const newComment = new Comment({ user: userId, movie: movieId, content })
        await newComment.save()

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found!!!" })
        }

        user.comments.push(newComment._id)
        user.ratingPoints = (user.ratingPoints || 0) + 5
        await user.save()

        const createdComment = await Comment.findById(newComment._id)
            .populate("user", "name")
            .exec()

        res.status(201).json({ comment: createdComment })
    } catch (err) {
        next(err)
    }
}

export const userDeleteComment = async (req, res, next) => {
    try {
        const id = req.params.commentId
        const comment = await Comment.findById(id)
        const userId = comment.user

        if (!comment) {
            return res.status(404).json({ message: "Cmt does not exist!!!" })
        }

        await Comment.findByIdAndDelete(id)

        const user = await User.findById(userId)
        user.comments.pull(comment._id)

        if (user.ratingPoints && user.ratingPoints > 0) {
            user.ratingPoints -= 5
        } else {
            user.ratingPoints = 0
        }

        await user.save()

        res.status(200).json({ message: "Successfully deleted cmt..." })
    } catch (err) {
        next(err)
    }
}

export const comparePassword = async (req, res, next) => {
    const { password } = req.body

    if (!password || password.trim() === "") {
        return res.status(422).json({ message: "invalid input..." })
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: "user not found..." })
        }

        const isPasswordMatch = bcrypt.compareSync(password, user.password)

        if (isPasswordMatch) {
            return res.status(200).json({ match: true })
        } else {
            return res.status(200).json({ match: false })
        }
    } catch (err) {
        next(err)
    }
}

export const getCancelBookingsByUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("cancelBookings")
            .lean()

        if (!user) {
            return res.status(404).json({ message: "user not found..." })
        }

        const cancelBookingIds = user.cancelBookings &&
            user.cancelBookings.map(cancelBooking => cancelBooking._id)
        const cancelBookings = await CancelBooking.find({ _id: { $in: cancelBookingIds } })
            .select("createdAt refunds approveRequest")
            .populate({
                path: "booking",
                select: "_id screening",
                populate: {
                    path: "screening",
                    select: "movie movieDate",
                    options: { withDeleted: true },
                    populate: {
                        path: "movie",
                        options: { withDeleted: true },
                        select: "title trailerId slug"
                    }
                }
            })
            .sort({ createdAt: -1 })
            .lean()

        const cancelBookingItems = cancelBookings.map(cancelBooking => {
            const booking = cancelBooking.booking
            const screening = booking ? booking.screening : null
            const movie = screening ? screening.movie : null

            return {
                _id: cancelBooking._id,
                cancellationTime: cancelBooking.createdAt,
                refunds: cancelBooking.refunds,
                approveRequest: cancelBooking.approveRequest,
                booking: booking ? {
                    _id: booking._id,
                    screening: {
                        movie: {
                            title: movie ? movie.title : null,
                            trailerId: movie ? movie.trailerId : null,
                            slug: movie ? movie.slug : null
                        },
                        movieDate: screening ? screening.movieDate : null
                    }
                } : null
            }
        })

        res.status(200).json({ cancelBookingItems })
    } catch (err) {
        next(err)
    }
}