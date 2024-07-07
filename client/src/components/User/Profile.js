import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography, Button } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { customerActions } from "../../store"
import { getCustomerProfile, getManagerProfile } from "../../api/userApi"
import { handleDate } from "../../util"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import UserUpdateModal from "./UpdateUser"
import { toast } from "react-toastify"
import "../../scss/App.scss"

const Profile = () => {
    const [customer, setCustomer] = useState()
    const [manager, setManager] = useState()
    const [render, setRender] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const customerId = localStorage.getItem("customerId")
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isCustomerLoggedIn) {
            getCustomerProfile(customerId)
                .then((res) => setCustomer(res.user))
                .catch((err) => console.error(err))
        } else if (isManagerLoggedIn) {
            getManagerProfile(localStorage.getItem("managerId"))
                .then((res) => setManager(res.manager))
                .catch((err) => console.error(err))
        } else {
            console.log("Can't get profile because no account is logged in yet")
        }
    }, [isCustomerLoggedIn, isManagerLoggedIn, customerId])

    const handleNavigate = (path) => {
        if (isCustomerLoggedIn) {
            navigate(path)
        } else if (isManagerLoggedIn) {
            toast.info(`Account ${manager.email} has not been authorized`)
        } else {
            toast.info("Unable to access")
        }
    }

    const handleProfileUpdate = (updatedUser) => {
        dispatch(customerActions.updateName({ name: updatedUser.name }))
        setCustomer(updatedUser)
    }

    return (
        <Box className="wrapper" color={"#fff"}>
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
                <Box sx={{
                    width: 250,
                    bgcolor: "#1a1b1e",
                    p: "20px",
                    borderRadius: "6px",
                    ".txt-hover.css-ahj2mt-MuiTypography-root": { mb: "12px" }
                }}>
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
                                        Birthday: {customer.birthDay ? handleDate(customer.birthDay) : "No information"}
                                    </Typography>
                                    <Typography className="txt-line">
                                        Gender: {customer.gender ? customer.gender : "No information"}
                                    </Typography>
                                    <Typography className="txt-line">
                                        Address: {customer.address ? customer.address : "No information"}
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
                                <Button className="btn lowercase" onClick={() => toast.info("Unable to save new password")}>
                                    Save Password
                                </Button>
                            </Box>
                        </form>
                    </Box>}
                </Box>
            </Box>

            {isModalOpen && <UserUpdateModal
                id={customerId}
                customerData={customer}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleProfileUpdate}
            />}
        </Box>
    )
}

export default Profile