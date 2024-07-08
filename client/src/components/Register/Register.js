import React, { useState } from "react"
import {
    Box,
    Typography,
    TextField,
    Link,
    Button
} from "@mui/material"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"
import { customerSendRegisterRequest } from "../../api/userApi"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Register = () => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: "",
        birthDay: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputs((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (inputs.password !== inputs.confirmPassword) {
            toast.error("Passwords do not match!!!")
            return
        }

        const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}/
        if (!passwordPattern.test(inputs.password)) {
            toast.error("Password must contain at least one uppercase letter" +
                ", one number, and one special character Xyz123!&%")
            return
        }

        customerSendRegisterRequest(inputs)
            .then((res) => {
                console.log(res)
                navigate("/login")
                toast.success(res.message)
            })
            .catch(err => console.error(err))
    }

    return (
        <Box className="auth__wrapper">
            <Brand />

            <form height={780} className="auth__frm" onSubmit={handleSubmit}>
                <Typography variant="h5" color="#ff0000">Register</Typography>

                <TextField
                    value={inputs.name}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="text"
                    placeholder="Full name"
                    name="name"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.email}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.phone}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="tel"
                    placeholder="Phone number"
                    name="phone"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.password}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    required
                />

                <TextField
                    value={inputs.confirmPassword}
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    onChange={handleChange}
                    required
                />

                <Button className="auth__btn" type="submit">SIGN UP</Button>

                <Box className="other">
                    <Box className="line"></Box>
                    <span>OR</span>
                    <Box className="line"></Box>
                </Box>

                <Box margin={"23px 0"}>
                    <Box sx={{
                        width: "100%",
                        height: 40,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        textTransform: "uppercase",
                        bgcolor: "#fff",
                        color: "#000",
                        cursor: "pointer",
                        ":hover": {
                            opacity: 0.8
                        }
                    }}>
                        <Typography>Social Other</Typography>
                    </Box>
                </Box>

                <Typography className="question-switch">
                    Do you already have an account? <Link onClick={() => navigate("/login")}>Sign in</Link>
                </Typography>
            </form>
        </Box>
    )
}

export default Register