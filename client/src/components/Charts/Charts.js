import React, { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Stack,
    Avatar
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getCustomersRanking } from "../../api/userApi"
import Loading from "../Loading/Loading"
import { Tooltip } from "react-tooltip"
import { Helmet } from "react-helmet"
import { formatTitle } from "../../App"
import "../../scss/App.scss"

const Charts = () => {
    const [customersRanking, setCustomersRanking] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        setIsLoading(true)
        getCustomersRanking()
            .then((res) => setCustomersRanking(res.customersStatistics))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <Box className="wrapper">
            <Helmet><title>{formatTitle(t("charts.title"))}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                <Typography className="breadcrumb__item">{t("charts.title")}</Typography>
            </Box>

            <Typography
                textAlign={"center"}
                variant="h4"
                color={"#fff"}
                margin={"20px 0"}
                data-tooltip-content={t("charts.description")}
                data-tooltip-id="chartDescription"
            >
                <span style={{ color: "#ff0000" }}>#</span>CHARTS
            </Typography>

            <Tooltip
                id="chartDescription"
                place="bottom"
                effect="solid"
                style={{
                    width: 570,
                    textAlign: "justify",
                    lineHeight: 1.5,
                    background: "rgba(37, 37, 38, 0.95)",
                    borderRadius: "16px",
                }}
            />

            {customersRanking && !isLoading ?
                <Table fontSize="1rem" color="#fff !important" sx={{
                    ".css-1bigob2, .css-q34dxg": { color: "#fff !important" }
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("charts.rank")}</TableCell>
                            <TableCell>{t("cinemaTicket.customerName")}</TableCell>
                            <TableCell>{t("charts.totalBookings")}</TableCell>
                            <TableCell>{t("comment.feedback")}</TableCell>
                            <TableCell>{t("header.ratingPoints")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {customersRanking.map((customer) => (
                            <TableRow>
                                <TableCell>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/img/rank/${customer.rank}.png`}
                                        width={"32px"}
                                        style={{ marginTop: "5px" }}
                                        alt="rank_icon"
                                    />
                                </TableCell>

                                <TableCell>
                                    <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
                                        <Avatar />
                                        <Typography
                                            variant="subtitle2"
                                            fontSize={"1rem"}
                                            color={customer.name === localStorage.getItem("customerName")
                                                ? "#e50914" : "#fff"}
                                        >
                                            {customer.name}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell>{customer.totalBookings}</TableCell>
                                <TableCell>{customer.feedbacks}</TableCell>
                                <TableCell>{customer.ratingPoints} {t("charts.points")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> : <Loading />}
        </Box>
    )
}

export default Charts