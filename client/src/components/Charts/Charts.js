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
import { getCustomersRanking } from "../../api/userApi"
import Loading from "../Loading/Loading"
import { Tooltip } from "react-tooltip"
import "../../scss/App.scss"

const Charts = () => {
    const [customersRanking, setCustomersRanking] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)

        getCustomersRanking()
            .then((res) => setCustomersRanking(res.customersStatistics))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <Box className="wrapper">
            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    Home
                </Typography>
                <Typography className="breadcrumb__item">Charts</Typography>
            </Box>

            <Typography
                textAlign={"center"}
                variant="h4"
                color={"#fff"}
                margin={"20px 0"}
                data-tooltip-content="
                    Potential customer rankings are rankings of the 10 most potential customers 
                    of the Buy Movie Tickets system based on rating points of each customer. 
                    Rating points are calculated based on the number of tickets customers 
                    have ordered and the number of feedback customers leave for each movie. 
                    From there, we present 10 typical customers below. Are you in this top 10?"
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
                <Table fontSize="1rem" color="#fff">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Total bookings</TableCell>
                            <TableCell>Feedbacks</TableCell>
                            <TableCell>Rating points</TableCell>
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
                                <TableCell>{customer.ratingPoints} point</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> : <Loading />}
        </Box>
    )
}

export default Charts