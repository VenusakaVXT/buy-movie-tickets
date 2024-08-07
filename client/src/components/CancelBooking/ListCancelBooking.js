import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"
import { Helmet } from "react-helmet"
import { useSelector } from "react-redux"
import { getCancelBookingsByUser } from "../../api/userApi"
import { getCinemaById, getCancelBookingsByCinema } from "../../api/cinemaApi"
import NoDataComponent from "../NotFoundPage/NoDataComponent"
import { handleDate, formatDateInput } from "../../util"
import Loading from "../Loading/Loading"
import { DataGrid } from "@mui/x-data-grid"
import { useStyles } from "../Manager/Statistical"
import { formatTitle } from "../../App"
import "../../scss/Cart.scss"

const ListCancelBooking = () => {
    const [cancelBookingsByUser, setCancelBookingsByUser] = useState()
    const [cancelBookingsByCinema, setCancelBookingsByCinema] = useState()
    const [cinemaName, setCinemaName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const isManagerLoggedIn = useSelector((state) => state.manager.isLoggedIn)
    const isCustomerLoggedIn = useSelector((state) => state.customer.isLoggedIn)
    const userId = localStorage.getItem("customerId")
    const cinemaId = localStorage.getItem("cinemaId")
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

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
        { field: "userId", headerName: t("cancelBooking.userId"), width: 250 },
        { field: "bookingId", headerName: t("cancelBooking.bookingId"), width: 250 },
        { field: "cancellationDate", headerName: t("cinemaTicket.date"), width: 180 },
        { field: "refunds", headerName: t("cancelBooking.refunds"), width: 180 },
        { field: "approveRequest", headerName: t("cancelBooking.status"), width: 180 },
        {
            field: "cancelBookingId",
            headerName: t("cart.viewDetails"),
            width: 120,
            renderCell: (params) => (
                <Typography
                    component={Link}
                    to={`/manager/cancel-booking/${params.row.cancelBookingId}/detail`}
                    className="txt-hover"
                    textAlign={"center"}
                >
                    {i18n.language === "en" ? "View" : "Xem"}
                </Typography>
            )
        }
    ]

    const cancelBookingRows = cancelBookingsByCinema && cancelBookingsByCinema.map((row, index) => ({
        id: index + 1,
        userId: row.user,
        bookingId: row.booking,
        cancellationDate: i18n.language === "en" ? formatDateInput(row.createdAt) : handleDate(row.createdAt),
        refunds: `${row.refunds.toLocaleString("vi-VN")} VNĐ`,
        approveRequest: row.approveRequest ? t("cancelBooking.approved") : t("cancelBooking.awaitApproval"),
        cancelBookingId: row._id
    }))

    return (
        <Box>
            <Helmet><title>{formatTitle(t("titlePage.lstCancelBooking"))}</title></Helmet>

            {!isLoading && (cancelBookingsByUser || cancelBookingsByCinema) ?
                <Box className="cart__wrapper">
                    <Box className="breadcrumb" m={0}>
                        <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                            {t("header.home")}
                        </Typography>
                        <Typography className="breadcrumb__item">
                            {t("header.lstCancelBooking")}
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
                                        <Typography>{t(`movies.${cancelBooking.booking.screening.movie.slug}`)}</Typography>
                                        <Typography>
                                            {i18n.language === "en"
                                                ? cancelBooking.booking.screening.movieDate
                                                : handleDate(cancelBooking.booking.screening.movieDate)
                                            }
                                        </Typography>
                                    </Box>

                                    <Box className="col2">
                                        <Typography>{t("cancelBooking.cancelDate")}</Typography>
                                        <Typography>
                                            {i18n.language === "en"
                                                ? formatDateInput(cancelBooking.cancellationTime)
                                                : handleDate(cancelBooking.cancellationTime)
                                            }
                                        </Typography>
                                    </Box>

                                    <Box className="col3">
                                        <Typography>{t("cancelBooking.refunds")}</Typography>
                                        <Typography>{cancelBooking.refunds.toLocaleString("vi-VN")} VNĐ</Typography>
                                    </Box>

                                    <Box className="col4">
                                        <ListItemText>{cancelBooking.approveRequest
                                            ? t("cancelBooking.approved") : t("cancelBooking.awaitApproval")}
                                        </ListItemText>
                                    </Box>
                                </ListItem>
                            )) : <NoDataComponent content={(t("cancelBooking.noData"))} />}
                        </List>
                        : isManagerLoggedIn && cancelBookingsByCinema && <Box mb={12}>
                            {i18n.language === "en"
                                ? <Typography variant="h5" color={"#fff"} m={"20px 0"}>
                                    List of <span style={{ color: "#e50914" }}>{cinemaName}</span>'s canceled bookings
                                </Typography>
                                : <Typography variant="h5" color={"#fff"} m={"20px 0"}>
                                    {t("cancelBooking.h5")} <span style={{ color: "#e50914" }}>{cinemaName}</span>
                                </Typography>
                            }

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