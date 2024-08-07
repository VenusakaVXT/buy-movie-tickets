import React, { useEffect, useState, useCallback } from "react"
import { Box, Typography, Avatar, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { getMovieStatistics } from "../../api/movieApi"
import { getCustomersRanking, getEmployeeStatistics } from "../../api/userApi"
import { getCinemaStatistical } from "../../api/cinemaApi"
import Loading from "../Loading/Loading"
import BarChartIcon from "@mui/icons-material/BarChart"
import {
    LineChart,
    axisClasses,
    PieChart,
    useDrawingArea,
    BarChart
} from "@mui/x-charts"
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    useGridApiContext
} from "@mui/x-data-grid"
import { useTheme, styled } from "@mui/material/styles"
import { convertToAcronym } from "../../util"
import { Tooltip } from "react-tooltip"
import CircleIcon from "@mui/icons-material/Circle"
import { useTranslation } from "react-i18next"
import { formatTitle } from "../../App"
import "../../scss/App.scss"
import "../../scss/Statistical.scss"

const colorStyle = {
    mainColor: "#e50914",
    secondaryColor: "#ff0000",
    mainBackground: "#151517",
    secondBackground: "#1a1b1e",
    thirdBackground: "rgba(81, 88, 99, 0.3)",
    fourthBackground: "#2f3032",
    boldTxt: "#2d2d2e",
    frmColor: "#767676",
    txtColor: "#fff"
}

export const useStyles = {
    datagridview: {
        ".MuiDataGrid-container--top [role=row], .MuiDataGrid-cell": {
            backgroundColor: colorStyle.secondBackground,
            color: colorStyle.txtColor,
            fontSize: "16px"
        },
        ".css-128fb87-MuiDataGrid-toolbarContainer, .css-1yqais2": {
            display: "flex !important",
            justifyContent: "flex-end !important"
        },
        ".css-1knaqv7-MuiButtonBase-root-MuiButton-root, .css-1rtnrqa": {
            color: `${colorStyle.mainColor} !important`
        },
        ".css-1pe4mpk-MuiButtonBase-root-MuiIconButton-root": {
            color: `${colorStyle.txtColor} !important`
        },
        ".css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar, .MuiDataGrid-footerContainer": {
            color: `${colorStyle.txtColor} !important`
        },
        ".css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon, .css-1mf6u8l-MuiSvgIcon-root-MuiSelect-icon": {
            color: `${colorStyle.txtColor} !important`
        },
        ".css-8nphli, .css-1utq5rl, .css-1wkhih1": {
            color: `${colorStyle.txtColor} !important`
        }
    }
}

const StyledText = styled("text")(({ theme }) => ({
    fill: colorStyle.txtColor,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20
}))

const PieCenterLabel = ({ children }) => {
    const { width, height, left, top } = useDrawingArea()

    return (
        <>
            <StyledText
                x={left + width / 2}
                y={top + height / 2}
                data-tooltip-content={children}
                data-tooltip-id="movieTitle"
            >
                {convertToAcronym(children)}
            </StyledText>

            <Tooltip
                id="movieTitle"
                place="top"
                effect="solid"
                style={{
                    background: "rgba(37, 37, 38, 0.95)",
                    borderRadius: "16px",
                }}
            />
        </>
    )
}

const Statistical = () => {
    const [tab, setTab] = useState(1)
    const [moviesStatistics, setMoviesStatistics] = useState([])
    const [employeesStatistics, setEmployeesStatistics] = useState({})
    const [customersRanking, setCustomersRanking] = useState([])
    const [cinemaStatistical, setCinemaStatistical] = useState([])
    const [selectedMovie, setSelectedMovie] = useState({})
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        percentSeatBooked: false,
        percentSeatNotBooked: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        setIsLoading(true)
        switch (tab) {
            case 1:
                getMovieStatistics()
                    .then((res) => {
                        setMoviesStatistics(res.moviesStatistics)
                        if (res.moviesStatistics.length > 0) {
                            const firstMovie = res.moviesStatistics[0]
                            setSelectedMovie({
                                title: firstMovie.title,
                                percentSeatBooked: firstMovie.percentSeatBooked,
                                percentSeatNotBooked: firstMovie.percentSeatNotBooked
                            })
                        }
                    })
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case 2:
                getEmployeeStatistics()
                    .then((res) => setEmployeesStatistics(res.employeesStatistics))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case 3:
                getCustomersRanking()
                    .then((res) => setCustomersRanking(res.customersStatistics))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            case 4:
                getCinemaStatistical()
                    .then((res) => setCinemaStatistical(res.cinemaStatistical))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
                break
            default:
                setIsLoading(false)
                break
        }
    }, [tab])

    const handleTabClick = (tabIndex) => setTab(tabIndex)

    const createDataChart = (time, amount) => {
        return { time, amount: amount ?? null }
    }

    const dataChart = [
        createDataChart("9:00", 0),
        createDataChart("10:00", 200),
        createDataChart("11:00", 600),
        createDataChart("12:00", 800),
        createDataChart("13:00", 1000),
        createDataChart("14:00", 1200),
        createDataChart("15:00", 1400),
        createDataChart("16:00", 1400),
        createDataChart("17:00", 1600),
        createDataChart("18:00", 1800),
        createDataChart("19:00", 2400),
        createDataChart("20:00", 2400),
        createDataChart("21:00", 2200),
        createDataChart("22:00", 2000),
        createDataChart("23:00")
    ]

    const valueFormatter = (val) => `${val}%`

    const movieColumns = [
        { field: "id", headerName: "ID", type: "number", width: 100 },
        { field: "title", headerName: t("addMovie.movieTitle"), width: 300 },
        { field: "totalScreenings", headerName: t("statistical.totalScreenings"), type: "number", width: 210 },
        { field: "ticketsBookedLength", headerName: t("statistical.ticketsBooked"), type: "number", width: 180 },
        { field: "revenue", headerName: t("statistical.revenue"), type: "number", width: 180 },
        { field: "percentSeatBooked", headerName: t("seatDiagram.seatsBooked"), valueFormatter, width: 180 },
        { field: "percentSeatNotBooked", headerName: t("seatDiagram.seatsNotBooked"), valueFormatter, width: 180 }
    ]

    const employeeColumns = [
        { field: "id", headerName: "ID", type: "number", width: 85 },
        { field: "email", headerName: "Email", width: 300 },
        { field: "position", headerName: t("profile.position"), width: 225 },
        { field: "cinemaName", headerName: t("header.cinema"), width: 150 },
        {
            field: "amountOfWorkDone",
            headerName: t("statistical.workDone"),
            type: "number",
            width: 120,
            description: t("statistical.descriptionWorkDone")
        },
        {
            field: "isOnline",
            headerName: t("statistical.status"),
            width: 120,
            renderCell: (params) => (
                <span style={{ position: "relative" }}>
                    <CircleIcon
                        fontSize="6px"
                        htmlColor={params.row.isOnline ? "#20be22" : "#ff0000"}
                        style={{
                            position: "absolute",
                            top: 0,
                            borderRadius: "50%",
                            boxShadow: "0 0 10px rgba(52, 152, 219, 0.8)",
                        }}
                    />
                    <span style={{ marginLeft: 20 }}>{params.row.isOnline ? "Online" : "Offline"}</span>
                </span>
            )
        }
    ]

    const customerColumns = [
        { field: "id", headerName: "ID", type: "number", width: 50 },
        {
            field: "rank",
            headerName: t("charts.rank"),
            width: 100,
            renderCell: (params) => (
                <img
                    src={`${process.env.REACT_APP_API_URL}/img/rank/${params.row.rank}.png`}
                    width={"32px"}
                    style={{ marginTop: "5px" }}
                    alt="rank_icon"
                />
            )
        },
        {
            field: "name",
            headerName: t("cinemaTicket.customerName"),
            width: 320,
            renderCell: (params) => (
                <Stack sx={{ alignItems: "center" }} direction="row" spacing={2} marginTop={"5px"}>
                    <Avatar />
                    <Typography variant="subtitle2" fontSize={"1rem"}>
                        {params.row.name}
                    </Typography>
                </Stack>
            )
        },
        { field: "totalBookings", headerName: t("charts.totalBookings"), type: "number", width: 180 },
        { field: "feedbacks", headerName: t("comment.feedback"), type: "number", width: 120 },
        {
            field: "ratingPoints",
            headerName: t("header.ratingPoints"),
            width: 180,
            type: "number",
            description: t("statistical.descriptionRatingPoints")
        },
        {
            field: "isOnline",
            headerName: t("statistical.status"),
            width: 120,
            renderCell: (params) => (
                <span style={{ position: "relative" }}>
                    <CircleIcon
                        fontSize="6px"
                        htmlColor={params.row.isOnline ? "#20be22" : "#ff0000"}
                        style={{
                            position: "absolute",
                            top: 0,
                            borderRadius: "50%",
                            boxShadow: "0 0 10px rgba(52, 152, 219, 0.8)",
                        }}
                    />
                    <span style={{ marginLeft: 20 }}>{params.row.isOnline ? "Online" : "Offline"}</span>
                </span>
            )
        }
    ]

    const cinemaColumns = [
        { field: "id", headerName: "ID", type: "number", width: 100 },
        { field: "name", headerName: t("statistical.cinemaName"), width: 180 },
        { field: "cinemaRoomLength", headerName: t("statistical.cinemaRooms"), type: "number", width: 180 },
        { field: "employeeLength", headerName: t("statistical.employees"), type: "number", width: 180 },
        { field: "screeningLength", headerName: t("statistical.screenings"), type: "number", width: 180 },
        { field: "cinemaRevenue", headerName: t("statistical.revenue"), type: "number", width: 180 },
    ]

    const movieRows = moviesStatistics.map((row, index) => ({
        id: index + 1,
        title: row.title,
        totalScreenings: row.totalScreenings,
        ticketsBookedLength: row.ticketsBookedLength,
        revenue: row.revenue,
        percentSeatBooked: row.percentSeatBooked,
        percentSeatNotBooked: row.percentSeatNotBooked
    }))

    const employeeDetails = employeesStatistics.employees ? employeesStatistics.employees : []

    const employeeRows = Array.isArray(employeeDetails) && employeeDetails.map((row, index) => ({
        id: index + 1,
        email: row.email,
        position: i18n.language === "en" ? row.position : row.position === "Manage screenings"
            ? t("statistical.manageScreenings") : row.position === "Manage movies"
                ? t("statistical.manageMovies") : t("profile.noInfo"),
        cinemaName: row.cinemaName,
        amountOfWorkDone: row.amountOfWorkDone,
        isOnline: row.isOnline
    }))

    const customerRows = customersRanking.map((row) => ({
        id: row.rank,
        rank: row.rank,
        name: row.name,
        totalBookings: row.totalBookings,
        feedbacks: row.feedbacks,
        ratingPoints: row.ratingPoints,
        isOnline: row.isOnline
    }))

    const cinemaRows = cinemaStatistical.map((row, index) => ({
        id: index + 1,
        name: row.name,
        cinemaRoomLength: row.cinemaRoomLength,
        employeeLength: row.employeeLength,
        screeningLength: row.screeningLength,
        cinemaRevenue: row.cinemaRevenue
    }))

    const handleMovieRowClick = (params) => {
        const clickedMovie = moviesStatistics.find(movie => movie.title === params.row.title)

        if (clickedMovie) {
            setSelectedMovie({
                title: clickedMovie.title,
                percentSeatBooked: clickedMovie.percentSeatBooked,
                percentSeatNotBooked: clickedMovie.percentSeatNotBooked
            })
        }
    }

    const CustomToolbar = () => {
        const apiRef = useGridApiContext()
        const dataName =
            tab === 1 ? "movie"
                : tab === 2 ? "employee"
                    : tab === 3 ? "customer"
                        : tab === 4 ? "cinema" : "data"
        const options = { allColumns: true, fileName: `bmt_${dataName}_statistical` }

        const setColumnDimensions = useCallback(() => {
            const columns = apiRef.current.getAllColumns().map(col => {
                if (!col.computedWidth) {
                    return { ...col, computedWidth: col.width || 100 }
                }
                return col
            })
            apiRef.current.updateColumns(columns)
        }, [apiRef])

        useEffect(() => { setColumnDimensions() }, [setColumnDimensions])

        return (
            <GridToolbarContainer>
                <GridToolbarExport
                    csvOptions={options}
                    printOptions={options}
                    onClick={() => setColumnDimensions()}
                />
            </GridToolbarContainer>
        )
    }

    return (
        <Box margin={"15px 46px"} className="statistical__wrapper">
            <Helmet><title>{formatTitle(t("statistical.title"))}</title></Helmet>

            <Box className="breadcrumb" margin={0}>
                <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                    {t("header.home")}
                </Typography>
                <Typography className="breadcrumb__item">{t("statistical.title")}</Typography>
            </Box>

            <Box display={"flex"} marginTop={"15px"}>
                <Box width={215} height={"100vh"} bgcolor={"#1a1b1e"} borderRadius={"0.25rem"} marginRight={"15px"}>
                    <Typography variant="h4"><BarChartIcon fontSize="2rem" />{t("statistical.title")}</Typography>
                    <hr />

                    <Box className="statistical__tabs">
                        <Box
                            className={`statistical__tab-item ${tab === 1 ? "active" : ""}`}
                            onClick={() => handleTabClick(1)}
                        >
                            {t("statistical.movies")}
                        </Box>
                        <Box
                            className={`statistical__tab-item ${tab === 2 ? "active" : ""}`}
                            onClick={() => handleTabClick(2)}
                        >
                            {t("statistical.employees")}
                        </Box>
                        <Box
                            className={`statistical__tab-item ${tab === 3 ? "active" : ""}`}
                            onClick={() => handleTabClick(3)}
                        >
                            {t("statistical.customers")}
                        </Box>
                        <Box
                            className={`statistical__tab-item ${tab === 4 ? "active" : ""}`}
                            onClick={() => handleTabClick(4)}
                        >
                            {t("statistical.cinemas")}
                        </Box>
                    </Box>
                </Box>

                <Box width={"calc(100% - (215px + 15px))"} height={"100vh"}>
                    {isLoading ? (
                        <Loading />
                    ) : tab === 1 ? (
                        <>
                            <Box className="chart-wrapper">
                                <Box className="chart-item chart-growth">
                                    <Typography variant="h6" color={colorStyle.mainColor}>
                                        {t("statistical.bookingSpeed")}
                                    </Typography>

                                    <Box className="chart-display">
                                        <LineChart
                                            dataset={dataChart}
                                            margin={{ top: 16, right: 20, left: 70, bottom: 30 }}
                                            xAxis={[
                                                {
                                                    scaleType: "point",
                                                    dataKey: "time",
                                                    tickNumber: 2,
                                                    tickLabelStyle: theme.typography.body2
                                                }
                                            ]}
                                            yAxis={[
                                                {
                                                    label: t("statistical.convertUnitPrice"),
                                                    labelStyle: {
                                                        ...theme.typography.body1,
                                                        fill: colorStyle.txtColor
                                                    },
                                                    tickLabelStyle: theme.typography.body2,
                                                    max: 3000,
                                                    tickNumber: 4
                                                }
                                            ]}
                                            series={[
                                                {
                                                    dataKey: "amount",
                                                    showMark: false,
                                                    color: colorStyle.mainColor
                                                }
                                            ]}
                                            sx={{
                                                [`.${axisClasses.root} line`]: { stroke: colorStyle.txtColor },
                                                [`.${axisClasses.root} text`]: { fill: colorStyle.txtColor },
                                                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                                                    transform: "translateX(-25px)",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box className="chart-item chart-pie">
                                    <Typography variant="h6" color={colorStyle.mainColor}>
                                        {t("statistical.bookingPercentChart")}
                                    </Typography>

                                    <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                        {t("statistical.unitPercent")}
                                    </Typography>

                                    <PieChart
                                        series={[{
                                            data: selectedMovie ? [
                                                {
                                                    value: selectedMovie.percentSeatBooked,
                                                    label: t("seatDiagram.seatBooked"),
                                                    color: colorStyle.mainColor
                                                },
                                                {
                                                    value: selectedMovie.percentSeatNotBooked,
                                                    label: t("seatDiagram.seatNotBooked"),
                                                    color: colorStyle.frmColor
                                                }
                                            ] : [],
                                            innerRadius: 80
                                        }]}
                                        {...{ width: 400, height: 200 }}
                                        sx={{
                                            marginLeft: "21px",
                                            ".css-1u0lry5-MuiChartsLegend-root": {
                                                display: "none !important"
                                            },
                                        }}
                                    >
                                        {selectedMovie && <PieCenterLabel>{selectedMovie.title}</PieCenterLabel>}
                                    </PieChart>

                                    <Box className="chart-note">
                                        <Box className="chart-note-item" m={"0 36px 0 32px"}>
                                            <Box className="chart-note-color" bgcolor={colorStyle.mainColor}></Box>
                                            <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                                : {t("seatDiagram.seatBooked")}
                                            </Typography>
                                        </Box>

                                        <Box className="chart-note-item">
                                            <Box className="chart-note-color" bgcolor={colorStyle.frmColor}></Box>
                                            <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                                : {t("seatDiagram.seatNotBooked")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="statistical__tables">
                                <DataGrid
                                    rows={movieRows}
                                    columns={movieColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 5 }
                                        }
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    sx={useStyles.datagridview}
                                    onRowClick={handleMovieRowClick}
                                    columnVisibilityModel={columnVisibilityModel}
                                    onColumnVisibilityModelChange={(newModel) =>
                                        setColumnVisibilityModel(newModel)
                                    }
                                    slots={{ toolbar: CustomToolbar }}
                                />
                            </Box>
                        </>
                    ) : tab === 2 ? (
                        <>
                            <Box className="chart-wrapper">
                                <Box className="chart-item chart-growth">
                                    <Typography variant="h6" color={colorStyle.mainColor}>
                                        {t("statistical.jobGoals")}
                                    </Typography>

                                    <Box className="chart-display">
                                        <BarChart
                                            width={650}
                                            height={250}
                                            margin={{ top: 16, right: 20, left: 40, bottom: 30 }}
                                            series={[
                                                {
                                                    data: [22, 22, 31, 53, 60, 70, 75],
                                                    label: t("statistical.targetsSet"),
                                                    color: colorStyle.frmColor
                                                },
                                                {
                                                    data: [40, 42, 48, 61, 70, 80, 85],
                                                    label: t("statistical.levelOfCompletion"),
                                                    color: colorStyle.mainColor
                                                }
                                            ]}
                                            xAxis={[{
                                                data: t("statistical.daysArr", { returnObjects: true }),
                                                scaleType: "band",
                                                tickLabelStyle: theme.typography.body2
                                            }]}
                                            yAxis={[{
                                                label: t("statistical.unitPercent"),
                                                labelStyle: { fill: colorStyle.txtColor },
                                                tickLabelStyle: theme.typography.body2,
                                                max: 100
                                            }]}
                                            sx={{
                                                [`.${axisClasses.root} line`]: { stroke: colorStyle.txtColor },
                                                [`.${axisClasses.root} text`]: { fill: colorStyle.txtColor },
                                                "text": { fill: `${colorStyle.txtColor} !important` }
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box className="chart-item chart-pie" width={"calc(100% - (65% + 15px)) !important"}>
                                    <Typography variant="h6" color={colorStyle.mainColor}>
                                        {t("statistical.percentEmployees")}
                                    </Typography>

                                    <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                        {t("statistical.unitPercent")}
                                    </Typography>

                                    <PieChart
                                        width={400}
                                        height={200}
                                        series={[{
                                            data: employeesStatistics ? [
                                                {
                                                    value: employeesStatistics.percents &&
                                                        employeesStatistics.percents.manageMovies,
                                                    label: t("statistical.manageMovies"),
                                                    color: colorStyle.mainColor
                                                },
                                                {
                                                    value: employeesStatistics.percents &&
                                                        employeesStatistics.percents.manageScreenings,
                                                    label: t("statistical.manageScreenings"),
                                                    color: colorStyle.thirdBackground
                                                },
                                                {
                                                    value: employeesStatistics.percents &&
                                                        employeesStatistics.percents.others,
                                                    label: t("statistical.others"),
                                                    color: colorStyle.frmColor
                                                }
                                            ] : []
                                        }]}
                                        sx={{
                                            ".css-1u0lry5-MuiChartsLegend-root": {
                                                display: "none !important"
                                            }
                                        }}
                                    />

                                    <Box className="chart-note" justifyContent={"space-between !important"}>
                                        <Box className="chart-note-item" ml={4}>
                                            <Box className="chart-note-color" bgcolor={colorStyle.mainColor}></Box>
                                            <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                                : {t("statistical.acronymManageMovies")}
                                            </Typography>
                                        </Box>

                                        <Box className="chart-note-item">
                                            <Box className="chart-note-color" bgcolor={colorStyle.thirdBackground}></Box>
                                            <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                                : {t("statistical.acronymManageScreenings")}
                                            </Typography>
                                        </Box>

                                        <Box className="chart-note-item">
                                            <Box className="chart-note-color" bgcolor={colorStyle.frmColor}></Box>
                                            <Typography color={colorStyle.txtColor} fontSize={"0.875rem"}>
                                                : {t("statistical.others")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="statistical__tables">
                                <DataGrid
                                    rows={employeeRows}
                                    columns={employeeColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 5 }
                                        }
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    sx={useStyles.datagridview}
                                    slots={{ toolbar: CustomToolbar }}
                                />
                            </Box>
                        </>
                    ) : tab === 3 ? (
                        <Box height={"93%"}>
                            <Typography variant="h5" color={colorStyle.mainColor} marginBottom={"10px"}>
                                {t("statistical.potentialCustomerRankings")}
                            </Typography>

                            <DataGrid
                                rows={customerRows.slice(0, 10)}
                                columns={customerColumns}
                                columnVisibilityModel={{ id: false }}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                sx={useStyles.datagridview}
                                slots={{ toolbar: CustomToolbar }}
                                pagination={false}
                                hideFooter
                                disableSelectionOnClick
                            />
                        </Box>
                    ) : tab === 4 ? (
                        <>
                            <Box className="chart-wrapper" flexDirection={"column"}>
                                <Box className="chart-item" height={"100%"}>
                                    <BarChart
                                        margin={{ top: 16, right: 20, left: 40, bottom: 30 }}
                                        xAxis={[{
                                            data: cinemaRows.map(cinema => cinema.name),
                                            scaleType: "band",
                                            tickLabelStyle: theme.typography.body2
                                        }]}
                                        yAxis={[{
                                            label: t("statistical.unitMoney"),
                                            labelStyle: { fill: colorStyle.txtColor },
                                            tickLabelStyle: theme.typography.body2,
                                            tickNumber: 4,
                                        }]}
                                        series={[{
                                            data: cinemaRows.map(cinema => cinema.cinemaRevenue / 1000),
                                            label: t("statistical.revenue"),
                                            color: colorStyle.mainColor
                                        }]}
                                        sx={{
                                            [`.${axisClasses.root} line`]: { stroke: colorStyle.txtColor },
                                            [`.${axisClasses.root} text`]: { fill: colorStyle.txtColor },
                                            ".css-1u0lry5-MuiChartsLegend-root": { display: "none !important" }
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box className="statistical__tables">
                                <DataGrid
                                    rows={cinemaRows}
                                    columns={cinemaColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 5 }
                                        }
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    sx={useStyles.datagridview}
                                    slots={{ toolbar: CustomToolbar }}
                                />
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Box>
        </Box>
    )
}

export default Statistical