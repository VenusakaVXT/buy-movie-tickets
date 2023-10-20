import User from "../models/User"

export const getAllUsers = async (res, req, next) => {
    let users

    try {
        users = await User.find()
    } catch(err) {
        return console.error(err)
    }

    if (!users) {
        return res.status(500).json({
            message: "Unexpected Error Occurred!!!"
        })
    }

    return res.status(200).json({users})
}