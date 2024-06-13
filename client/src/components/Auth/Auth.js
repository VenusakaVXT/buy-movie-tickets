import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Typography,
    TextField,
    Link,
    Button
} from "@mui/material"
import Brand from "../Brand/Brand"
import "../../scss/Auth.scss"

const Auth = ({ onSubmit, signUp, role }) => {
    const [isSignUp, setIsSignUp] = useState(signUp)
    const [inputs, setInputs] = useState(isSignUp ? {
        name: "",
        email: "",
        phone: "",
        birthDay: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: ""
    } : role === "manager" ? {
        email: "",
        password: "",
    } : {
        nameAccount: "",
        password: "",
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prevState) => (
            {
                ...prevState,
                [e.target.name]: e.target.value
            }
        ))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isSignUp) {
            if (inputs.password !== inputs.confirmPassword) {
                alert("Passwords do not match!!!")
                return
            }

            const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}/
            if (!passwordPattern.test(inputs.password)) {
                alert("Password must contain at least one uppercase letter, one number, and one special character")
                return
            }
        }

        setIsSignUp(isSignUp)
        onSubmit(role === "manager" ? { inputs } : { inputs, signUp: isSignUp })
    }

    return (
        <Box className="auth__wrapper">
            <Brand />

            <form height={isSignUp ? "780" : "430"} className="auth__frm" onSubmit={handleSubmit}>
                <Typography variant="h5" color="#ff0000">
                    {isSignUp ? "Register" : role === "manager" ? "Manager Login" : "Customer Login"}
                </Typography>

                {isSignUp ? <>
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
                </> : <>
                    <TextField
                        value={role === "manager" ? inputs.email : inputs.nameAccount}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        type="text"
                        placeholder={role === "manager" ? "Email" : "Email/Phone number"}
                        name={role === "manager" ? "email" : "nameAccount"}
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
                </>}

                {!isSignUp && <Link className="forgot-password">Forgot password?</Link>}

                <Button className="auth__btn" type="submit">
                    {isSignUp ? "SIGN UP" : "LOGIN"}
                </Button>

                {role !== "manager" && <>
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

                    {isSignUp ?
                        <Typography className="question-switch">
                            Do you already have an account? <Link onClick={() => navigate("/customer/login")}>Sign in</Link>
                        </Typography>
                        :
                        <Typography className="question-switch">
                            New to Buy Movie Tickets? <Link onClick={() => navigate("/register")}>Sign up</Link>
                        </Typography>
                    }
                </>}
            </form>
        </Box>
    )
}

export default Auth