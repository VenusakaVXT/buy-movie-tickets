import React, { useState } from "react"
import {
    Modal,
    Box,
    Typography,
    TextField,
    FormLabel,
    Button,
    IconButton,
    FormControl,
    Select,
    MenuItem
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { updateUser } from "../../api/userApi"
import { formatDateInput } from "../../util"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

const setWidth = { width: "510px" }
const frmRow = { display: "flex", marginBottom: 2 }
const frmCol = { display: "flex", flexDirection: "column" }

const UserUpdateModal = ({ id, customerData, open, onClose, onProfileUpdate }) => {
    const [inputs, setInputs] = useState({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        birthDay: formatDateInput(customerData.birthDay),
        gender: customerData.gender,
        address: customerData.address
    })
    const { t, i18n } = useTranslation()

    const handleChange = (e) => {
        setInputs((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await updateUser(id, inputs)
            if (res) {
                toast.success(i18n.language === "us" ? res.message : t("profile.toastSuccessUpdateUser"))
                localStorage.setItem("customerName", inputs.name)
                onProfileUpdate(inputs)
                onClose()
            }
        } catch (err) {
            console.error(err)
            toast.error(t("profile.toastErrorUpdateUser"))
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <Box className="frm-wrapper" bgcolor={"#1a1b1e"} boxShadow={24} sx={{
                    width: "82%",
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} marginBottom={2}>
                        <Typography variant="h5" color={"#e50914"}>{t("profile.editProfile")}</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon sx={{ ":hover": { color: "#e50914" } }} />
                        </IconButton>
                    </Box>

                    <Box sx={frmRow}>
                        <Box sx={frmCol} marginRight={"20px"}>
                            <FormLabel>{t("cinemaTicket.customerName")}:</FormLabel>
                            <TextField
                                name="name"
                                variant="standard"
                                margin="normal"
                                value={inputs.name}
                                required
                                sx={setWidth}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={frmCol}>
                            <FormLabel>Email:</FormLabel>
                            <TextField
                                name="email"
                                variant="standard"
                                margin="normal"
                                value={inputs.email}
                                required
                                sx={setWidth}
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>

                    <Box sx={frmRow}>
                        <Box sx={frmCol} marginRight={"20px"}>
                            <FormLabel>{t("register.phoneNumber")}:</FormLabel>
                            <TextField
                                name="phone"
                                variant="standard"
                                margin="normal"
                                value={inputs.phone}
                                required
                                sx={setWidth}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={frmCol}>
                            <FormLabel>{t("profile.birthday")}:</FormLabel>
                            <input
                                type="date"
                                className="calendar"
                                name="birthDay"
                                value={inputs.birthDay}
                                style={setWidth}
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>

                    <Box sx={frmRow}>
                        <Box sx={frmCol} marginRight={"20px"}>
                            <FormLabel>{t("profile.gender")}:</FormLabel>
                            <FormControl sx={setWidth}>
                                <Select name="gender" value={inputs.gender} onChange={handleChange}>
                                    <MenuItem value={"Male"}>{t("profile.male")}</MenuItem>
                                    <MenuItem value={"Female"}>{t("profile.female")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={frmCol}>
                            <FormLabel>{t("profile.address")}:</FormLabel>
                            <TextField
                                name="address"
                                variant="standard"
                                margin="normal"
                                value={inputs.address}
                                sx={setWidth}
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>

                    <Box display={"flex"} justifyContent={"flex-end"}>
                        <Button className="btn lowercase" type="submit">{t("save")}</Button>
                    </Box>
                </Box>
            </form>
        </Modal>
    )
}

export default UserUpdateModal