import React, { useEffect, useState } from "react"
import { Modal, Box, Typography, IconButton, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { getComboByCinema } from "../../api/cinemaApi"
import { useTranslation } from "react-i18next"

const cssScrollY = {
    overflowY: "auto",
    paddingRight: "8px",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#555", borderRadius: "4px" },
    "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#888" }
}

const WaterCornCombo = ({ cinemaId, open, onClose }) => {
    const [waterCornCombos, setWaterCornCombos] = useState([])
    const [quantities, setQuantities] = useState({})
    const [selectedCombos, setSelectedCombos] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        if (open) {
            getComboByCinema(cinemaId)
                .then((res) => {
                    setWaterCornCombos(res.waterCornCombos)
                    const savedCombos = JSON.parse(localStorage.getItem("waterCornCombos")) || []
                    const initialQuantities = res.waterCornCombos.reduce((acc, combo) => {
                        const savedCombo = savedCombos.find((saved) => saved.id === combo._id)
                        acc[combo._id] = savedCombo ? savedCombo.quantity : 0
                        return acc
                    }, {})
                    setQuantities(initialQuantities)
                })
                .catch((err) => console.error(err))
        }
    }, [cinemaId, open])

    useEffect(() => {
        const updatedCombos = waterCornCombos
            .filter((combo) => quantities[combo._id] > 0)
            .map((combo) => ({
                ...combo,
                quantity: quantities[combo._id],
                totalPrice: quantities[combo._id] * combo.price,
            }))
        setSelectedCombos(updatedCombos)
    }, [quantities, waterCornCombos])

    const handleQuantityChange = (id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, prev[id] + delta),
        }))
    }

    const calculateTotalPrice = () => {
        return selectedCombos.reduce((total, combo) => total + combo.totalPrice, 0)
    }

    const handleSaveCombos = () => {
        const combosToSave = selectedCombos.map((combo) => ({
            id: combo._id,
            quantity: combo.quantity,
        }))
        localStorage.setItem("waterCornCombos", JSON.stringify(combosToSave))
        localStorage.setItem("waterCornComboMoney", JSON.stringify(calculateTotalPrice()))
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: "82%",
                    height: "80%",
                    backgroundColor: "#1a1b1e",
                    color: "#fff",
                    borderRadius: "8px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "16px",
                    boxShadow: 24,
                }}
            >
                <IconButton onClick={onClose} sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    color: "#fff",
                }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" color={"#e50914"} marginBottom={2}>
                    {t("waterCornCombo.title")}
                </Typography>
                {waterCornCombos && waterCornCombos.length > 0 ? (
                    <Box display="flex">
                        <Box
                            width={730}
                            maxHeight={400}
                            sx={cssScrollY}
                        >
                            {waterCornCombos.map((combo, index) => (
                                <Box
                                    key={combo._id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: index === waterCornCombos.length - 1 ? 0 : 2,
                                        padding: "8px",
                                        backgroundColor: "#2f3032",
                                        borderRadius: "8px",
                                    }}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}${combo.image}`}
                                        alt={combo.comboName}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            marginRight: "16px",
                                        }}
                                    />
                                    <Box flex={1}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {combo.comboName} - {combo.price.toLocaleString("vn-VN")} VNĐ
                                        </Typography>
                                        <Typography variant="body2" color="#ccc" marginBottom={3}>
                                            {combo.components}
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                onClick={() => handleQuantityChange(combo._id, -1)}
                                                sx={{ minWidth: "32px", padding: "4px" }}
                                            >
                                                -
                                            </Button>
                                            <Typography
                                                sx={{
                                                    margin: "0 8px",
                                                    width: "24px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {quantities[combo._id]}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                onClick={() => handleQuantityChange(combo._id, 1)}
                                                sx={{ minWidth: "32px", padding: "4px" }}
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box width={"calc(100% - 730px)"} padding="0 16px">
                            <Typography variant="h6" color="#e50914" textAlign={"center"} marginBottom={2}>
                                {t("waterCornCombo.selectedCombos")}
                            </Typography>
                            {selectedCombos.length > 0 ? (
                                <>
                                    <Box maxHeight={250} sx={cssScrollY}>
                                        {selectedCombos.map((combo) => (
                                            <Box
                                                key={combo._id}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                <Typography variant="body2" color="#fff">
                                                    {combo.quantity} x {combo.comboName}
                                                </Typography>
                                                <Typography variant="body2" color="#fff">
                                                    {combo.totalPrice}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <hr style={{ borderColor: "#555", margin: "16px 0" }} />
                                    <Typography variant="subtitle1" fontWeight="bold" color="#fff" textAlign={"right"}>
                                        {t("waterCornCombo.total")}: {calculateTotalPrice().toLocaleString("vn-VN")} VNĐ
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="#ccc">
                                    {t("waterCornCombo.noSelectedCombos")}
                                </Typography>
                            )}
                            <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"} marginTop={2}>
                                <Button className="btn lowercase" onClick={onClose}>
                                    {t("waterCornCombo.skip")}
                                </Button>
                                <Button className="btn lowercase" onClick={handleSaveCombos}>
                                    {t("waterCornCombo.complete")}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box width={"100%"} height={"85%"} display={"flex"} justifyContent="center" alignItems="center">
                        <Typography margin={"auto"} variant="body1" color="#ccc">
                            {t("waterCornCombo.noWaterCornCombos")}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Modal>
    )
}

export default WaterCornCombo