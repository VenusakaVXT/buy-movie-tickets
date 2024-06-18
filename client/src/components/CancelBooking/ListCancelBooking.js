import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { getCancelBookingsByUser } from "../../api/userApi"
import { getCinemaById, getCancelBookingsByCinema } from "../../api/cinemaApi"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import { handleDate } from "../../util"
import Loading from "../Loading/Loading"
import { DataGrid } from "@mui/x-data-grid"
import { useStyles } from "../Manager/Statistical"
import "../../scss/Cart.scss"

const ListCancelBooking = ({ title }) => {
    const [cancelBookingsByUser, setCancelBookingsByUser] = useState()
    const [cancelBookingsByCinema, setCancelBookingsByCinema] = useState()
    const [cinemaName, setCinemaName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const userId = localStorage.getItem("customerId")
    const cinemaId = localStorage.getItem("cinemaId")
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)

        isCustomerLoggedIn && getCancelBookingsByUser(userId)
            .then((res) => setCancelBookingsByUser(res.cancelBookingItems))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [isCustomerLoggedIn, userId])

    useEffect(() => {
        setIsLoading(true)

        isManagerLoggedIn && getCancelBookingsByCinema(cinemaId)
            .then((res) => setCancelBookingsByCinema(res.cancelBookingRows))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false))
    }, [isManagerLoggedIn, cinemaId])

    useEffect(() => {
        isManagerLoggedIn && getCinemaById(cinemaId)
            .then((res) => setCinemaName(res.cinema.name))
            .catch((err) => console.error(err))
    }, [isManagerLoggedIn, cinemaId])

    const cancelBookingColumns = [
        { field: "id", headerName: "ID", type: "number", width: 50 },
        { field: "userId", headerName: "UserID", width: 250 },
        { field: "bookingId", headerName: "BookingID", width: 250 },
        { field: "cancellationDate", headerName: "Date", width: 180 },
        { field: "refunds", headerName: "Refunds", width: 180 },
        { field: "approveRequest", headerName: "Status", width: 180 },
        {
            field: "cancelBookingId",
            headerName: "View details",
            width: 120,
            renderCell: (params) => (
                <Typography
                    component={Link}
                    to={`/manager/cancel-booking/${params.row.cancelBookingId}/detail`}
                    className="txt-hover"
                    textAlign={"center"}
                >
                    View
                </Typography>
            )
        }
    ]

    const cancelBookingRows = cancelBookingsByCinema && cancelBookingsByCinema.map((row, index) => ({
        id: index + 1,
        userId: row.user,
        bookingId: row.booking,
        cancellationDate: handleDate(row.createdAt),
        refunds: `${row.refunds.toLocaleString("vi-VN")} VNĐ`,
        approveRequest: row.approveRequest ? "Approved" : "Awaiting approval",
        cancelBookingId: row._id
    }))

    return (
        <Box>
            <Helmet><title>{title}</title></Helmet>

            {!isLoading && (cancelBookingsByUser || cancelBookingsByCinema) ?
                <Box className="cart__wrapper">
                    <Box className="breadcrumb" m={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            Home
                        </Typography>
                        <Typography className="breadcrumb__item">
                            List Cancel Booking
                        </Typography>
                    </Box>

                    {isCustomerLoggedIn && !isManagerLoggedIn ?
                        <List className="lst-booking" sx={{
                            mb: cancelBookingsByUser.length < 3 ? 17 : 0
                        }}>
                            {cancelBookingsByUser.length !== 0 ? cancelBookingsByUser.map((cancelBooking) => (
                                <ListItem
                                    key={cancelBooking._id}
                                    className="booking-item"
                                    sx={{
                                        ".col1 p, .col2 p, .col3 p": {
                                            color: "#fff !important",
                                            fontWeight: 400
                                        },
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate(`/customer/cancel-booking/${cancelBooking._id}/detail`)}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${cancelBooking.booking.screening.movie.trailerId}/maxresdefault.jpg`}
                                        alt={cancelBooking.booking.screening.movie.slug}
                                    />

                                    <Box className="col1">
                                        <Typography>{cancelBooking.booking.screening.movie.title}</Typography>
                                        <Typography>{cancelBooking.booking.screening.movieDate}</Typography>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>Cancellation date</Typography>
                                        <Typography>{handleDate(cancelBooking.cancellationTime)}</Typography>
                                    </Box>

                                    <Box className="col3">
                                        <Typography>Refunds</Typography>
                                        <Typography>{cancelBooking.refunds.toLocaleString("vi-VN")} VNĐ</Typography>
                                    </Box>

                                    <Box className="col4">
                                        <ListItemText>
                                            {cancelBooking.approveRequest ? "Approved" : "Awaiting approval"}
                                        </ListItemText>
                                    </Box>
                                </ListItem>
                            )) : <NoDataComponent content={"You haven't canceled any screenings yet"} />}
                        </List>
                        : isManagerLoggedIn && cancelBookingsByCinema && <Box mb={12}>
                            <Typography variant="h5" color={"#fff"} m={"20px 0"}>
                                List of <span style={{ color: "#e50914" }}>{cinemaName}</span>'s canceled bookings
                            </Typography>

                            <DataGrid
                                rows={cancelBookingRows}
                                columns={cancelBookingColumns}
                                columnVisibilityModel={{ id: false }}
                                autoHeight
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 }
                                    }
                                }}
                                pageSizeOptions={[5, 10]}
                                sx={useStyles.datagridview}
                            />
                        </Box>}
                </Box> : <Loading />}
        </Box>
    )
}

export default ListCancelBooking