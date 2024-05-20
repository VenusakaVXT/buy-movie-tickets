import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button } from "@mui/material"
import { useSelector } from "react-redux"
import { getCustomerProfile, getManagerProfile } from "../../api/userApi"
import { handleDate } from "../../util"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import UserUpdateModal from "./UpdateUser"
import "../../scss/App.scss"

const Profile = () => {
    const [customer, setCustomer] = useState()
    const [manager, setManager] = useState()
    const [render, setRender] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if (isCustomerLoggedIn) {
            getCustomerProfile(localStorage.getItem("customerId"))
                .then((res) => setCustomer(res.user))
                .catch((err) => console.error(err))
        } else if (isManagerLoggedIn) {
            getManagerProfile(localStorage.getItem("managerId"))
                .then((res) => setManager(res.manager))
                .catch((err) => console.error(err))
        } else {
            console.log("Can't get profile because no account is logged in yet")
        }
    }, [isCustomerLoggedIn, isManagerLoggedIn])

    const handleNavigate = (path) => {
        if (isCustomerLoggedIn) {
            navigate(path)
        } else if (isManagerLoggedIn) {
            alert(`Account ${manager.email} has not been authorized`)
        } else {
            alert("Unable to access")
        }
    }

    return (
        <Box margin={"30px 92px"} color={"#fff"}>
            <Box className="breadcrumb">
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item disable">
                    {`${isCustomerLoggedIn ? "Customer" : "Manager"} Profile`}
                </Typography>
                {!render && <Typography className="breadcrumb__item">
                    Change Password
                </Typography>}
            </Box>

            <Box margin={"20px 17px"} display={"flex"}>
                <Box width={"250x"} padding={"20px"} borderRadius={"6px"} backgroundColor={"#1a1b1e"}>
                    <Typography className="txt-hover">Personal information</Typography>
                    <Typography className="txt-hover">Passwords and security</Typography>
                    <hr style={{ marginBottom: "12px" }} />
                    <Typography className="txt-hover">Your powers</Typography>
                    <Typography className="txt-hover">Online payment</Typography>
                    <hr style={{ marginBottom: "12px" }} />
                    <Typography className="txt-hover">Terms of service</Typography>
                    <Typography className="txt-hover">Help</Typography>
                </Box>

                <Box width={"calc(100% - 250px)"} margin={"0 18px"}>
                    <Typography variant="h4" textAlign={"center"}>
                        {`${isCustomerLoggedIn ? "Customer" : "Manager"} Profile`}
                    </Typography>

                    {render ? <>
                        <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <AccountCircleIcon sx={{ fontSize: "12rem" }} />

                            <Box height={180} margin={"24px"}>
                                {isCustomerLoggedIn && customer && <>
                                    <Typography className="txt-line">Name: {customer.name}</Typography>
                                    <Typography className="txt-line">Email: {customer.email}</Typography>
                                    <Typography className="txt-line">Phone number: {customer.phone}</Typography>
                                    <Typography className="txt-line">
                                        Birth day: {customer.birthDay ? handleDate(customer.birthDay) : "No information"}
                                    </Typography>
                                    <Typography className="txt-line">
                                        Gender: {customer.gender ? customer.gender : "No information"}
                                    </Typography>
                                    <Typography className="txt-line">
                                        Adress: {customer.adress ? customer.adress : "No information"}
                                    </Typography>
                                </>}

                                {isManagerLoggedIn && manager && <>
                                    <Typography className="txt-line">Email: {manager.email}</Typography>
                                    <Typography className="txt-line">Position: {manager.position}</Typography>
                                    <Typography className="txt-line">Work at {manager.cinema.name}</Typography>
                                </>}
                            </Box>
                        </Box>

                        <Box display={"flex"} justifyContent={"center"}>
                            <Button className="btn lowercase" onClick={() => {
                                if (isCustomerLoggedIn) {
                                    setIsModalOpen(true)
                                } else {
                                    handleNavigate("edit-profile")
                                }
                            }}>
                                Edit profile
                            </Button>
                            <Button className="btn lowercase" onClick={() => {
                                if (isManagerLoggedIn) {
                                    handleNavigate("change-password")
                                } else {
                                    setRender(false)
                                }
                            }}>
                                Change Password
                            </Button>
                        </Box>
                    </> : <Box>
                        <form>
                            <label>Current password:</label>
                            <input className="input-form" placeholder="Enter current password..." />
                            <label>New password:</label>
                            <input className="input-form" placeholder="Enter new password..." />
                            <label>Re-enter password:</label>
                            <input className="input-form" placeholder="Re-enter password..." />

                            <Box display={"flex"} justifyContent={"center"}>
                                <Button className="btn lowercase" onClick={() => setRender(true)}>
                                    Back
                                </Button>
                                <Button className="btn lowercase" onClick={() => alert("Unable to save new password")}>
                                    Save Password
                                </Button>
                            </Box>
                        </form>
                    </Box>}
                </Box>
            </Box>

            {isModalOpen && <UserUpdateModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
        </Box>
    )
}

export default Profile