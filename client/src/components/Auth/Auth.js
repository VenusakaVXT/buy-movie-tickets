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
import FacebookLogin from "react-facebook-login"
import GoogleLogin from "react-google-login"
import "../../scss/Auth.scss"

const responseLinkLoginBtn = (response) => console.log(response)

const Auth = ({ onSubmit, signUp }) => {
    const [isSignUp, setIsSignUp] = useState(signUp)
    const [inputs, setInputs] = useState(isSignUp ? {
        name: "", 
        email: "",
        phone: "",
        birthDay: "",
        gender: "",
        adress: "",
        password: "",
        confirmPassword: ""
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
        setIsSignUp(isSignUp)
        onSubmit({ inputs, signUp: isSignUp })
    }

    return (
        <Box className="auth__wrapper">
            <Brand />

            <form height={isSignUp ? "780" : "430"} className="auth__frm" onSubmit={handleSubmit}>
                <Typography variant="h5" color="#ff0000">
                    {isSignUp ? "Register" : "Login"}
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
                    />

                    <TextField
                        value={inputs.email}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />

                    <TextField
                        value={inputs.phone}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        type="text"
                        placeholder="Phone number"
                        name="phone"
                        onChange={handleChange}
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
                    />
                </> : <>
                    <TextField
                        value={inputs.nameAccount}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        type="text"
                        placeholder="Email/Phone number"
                        name="nameAccount"
                        onChange={handleChange}
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
                    />
                </>}

                {!isSignUp && <Link className="forgot-password">Forgot password?</Link>}

                <Button className="auth__btn" type="submit">
                    {isSignUp ? "SIGN UP" : "LOGIN"}
                </Button>

                <Box className="other">
                    <Box className="line"></Box>
                    <span>OR</span>
                    <Box className="line"></Box>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"} margin={"23px 0"}>
                    <FacebookLogin
                        appId="1088597931155576"
                        autoLoad
                        icon="fa-facebook"
                        size="small"
                        textButton="Facebook"
                        callback={responseLinkLoginBtn}
                    />

                    <GoogleLogin
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        buttonText="Google"
                        onSuccess={responseLinkLoginBtn}
                        onFailure={responseLinkLoginBtn}
                        className="kep-login-google"
                        style={{ border: "none" }}
                    />
                </Box>

                {isSignUp ?
                    <Typography className="question-switch">
                        Do you already have an account? <Link onClick={() => navigate("/login")}>Sign in</Link>
                    </Typography>
                    :
                    <Typography className="question-switch">
                        New to Buy Movie Tickets? <Link onClick={() => navigate("/register")}>Sign up</Link>
                    </Typography>
                }
            </form>
        </Box>
    )
}

export default Auth
