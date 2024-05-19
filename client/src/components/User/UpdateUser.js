import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Grid
} from "@mui/material"

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
}

const fetchUserData = async (id) => {
    try {
        const res = await axios.get(`/user/${id}`)
        return res.data
    } catch (error) {
        console.error("Error fetching user data:", error)
        return null
    }
}

const UserUpdateModal = ({ open, onClose }) => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        phone: "",
        email: "",
        birthDay: "",
        gender: "",
        address: ""
    })

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchUserData(userId)
            if (userData) {
                setUser(userData)
            }
        }
        getUserData()
    }, [userId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        if (!user.name || !user.phone || !user.email) {
            alert("All fields are required.")
            return
        }

        try {
            const updatedUser = await updateUser(userId, user)
            if (updatedUser) {
                alert("User updated successfully")
                onClose()
                navigate("/users")
            }
        } catch (error) {
            console.error("Error updating user:", error)
        }
    }

    const updateUser = async (id, userData) => {
        try {
            const res = await axios.put(`/user/${id}`, userData)
            return res.data
        } catch (error) {
            console.error(error)
            return null
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update User
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Birthday"
                            name="birthDay"
                            type="date"
                            value={user.birthDay}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Gender"
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UserUpdateModal