import React from "react"
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import VideocamIcon from "@mui/icons-material/Videocam"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { Tooltip } from "react-tooltip"
import "../../scss/Screening.scss"

const ScreeningItem = ({ id, title, description, releaseDate, time, trailerId, slug, displayType }) => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    const handleLikeClick = (e) => {
        e.stopPropagation()
        e.currentTarget.classList.toggle("like")
    }

    if (displayType === false) {
        return (
            <Card
                sx={{
                    margin: 2,
                    width: 200,
                    height: 303,
                    borderRadius: 2,
                    ":hover": {
                        boxShadow: "10px 10px 20px #ccc",
                    },
                }}
            >
                <img
                    height={"40%"}
                    width={"100%"}
                    src={`https://img.youtube.com/vi/${trailerId}/maxresdefault.jpg`}
                    alt={title}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/movie-details/${slug}`)}
                />

                <CardContent sx={{ padding: 1 }}>
                    <Typography
                        className="title-height"
                        gutterBottom
                        variant="h5"
                        component="div"
                        onClick={() => navigate(`/movie-details/${slug}`)}
                    >
                        {i18n.language === "en" ? title : t(`movies.${slug}`)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <VideocamIcon fontSize="1rem" className="customic" />
                        {i18n.language === "en"
                            ? new Date(releaseDate).toDateString()
                            : releaseDate ? releaseDate : t("movieDetail.notyet")}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <AccessTimeIcon fontSize="0.8rem" className="customic" />
                        {time ? t("movieDetail.time", { time }) : t("movieDetail.notyet")}
                    </Typography>
                </CardContent>

                <CardActions>
                    <Button
                        sx={{
                            margin: "auto",
                            background: "#1a1b1e",
                            color: "#fff",
                            width: "100%",
                            ":hover": {
                                background: "#e50914",
                            },
                        }}
                        onClick={() => navigate(`/booking/${slug}`)}
                    >
                        {t("movieDetail.booking")}
                    </Button>
                </CardActions>
            </Card>
        )
    } else {
        return (
            <Card
                sx={{
                    background: "#272a2e",
                    display: "flex",
                    width: "100%",
                    height: 180,
                    margin: 2,
                    marginBottom: 0,
                    borderRadius: 2
                }}
            >
                <Box>
                    <img
                        height={"100%"}
                        width={"100%"}
                        src={`https://img.youtube.com/vi/${trailerId}/maxresdefault.jpg`}
                        alt={title}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/movie-details/${slug}`)}
                    />
                </Box>

                <Box padding={"8px 16px"}>
                    <CardContent className="p0">
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`/movie-details/${slug}`)}
                            color={"#fff"}
                        >
                            {i18n.language === "en" ? title : t(`movies.${slug}`)}
                        </Typography>

                        <Typography className="desciption-hw" variant="body2" color="#f2f2f2" textAlign={"justify"}>
                            {i18n.language === "vi"
                                ? t(`moviesDescription.${slug}`)
                                : description !== "" ? description : t("movieDetail.noDescription")}
                        </Typography>

                        <Box display={"flex"} margin={"8px 0"}>
                            <Typography variant="body2" color="#f2f2f2" marginRight={3}>
                                <VideocamIcon fontSize="1rem" className="customic" />
                                {t("movieDetail.releaseDate", {
                                    releaseDate: i18n.language === "en"
                                        ? new Date(releaseDate).toDateString()
                                        : releaseDate ? releaseDate : t("movieDetail.notyet")
                                })}
                            </Typography>

                            <Typography variant="body2" color="#f2f2f2">
                                <AccessTimeIcon fontSize="0.8rem" className="customic" />
                                {time ? t("movieDetail.time", { time }) : t("movieDetail.notyet")}
                            </Typography>
                        </Box>
                    </CardContent>

                    <CardActions className="p0">
                        <Button
                            sx={{
                                height: 36,
                                background: "#1a1b1e",
                                color: "#fff",
                                ":hover": {
                                    background: "#e50914",
                                },
                            }}
                            data-tooltip-id="favorite"
                            data-tooltip-content={t("movieDetail.favorite")}
                            onClick={handleLikeClick}
                        >
                            <FavoriteIcon />
                        </Button>

                        <Tooltip
                            id="favorite"
                            place="top"
                            effect="solid"
                            style={{ borderRadius: "16px" }}
                        />

                        <Button
                            sx={{
                                height: 36,
                                background: "#1a1b1e",
                                color: "#fff",
                                ":hover": {
                                    background: "#e50914",
                                },
                            }}
                            data-tooltip-id="book-tickets"
                            data-tooltip-content={t("movieDetail.booking")}
                            onClick={() => navigate(`/booking/${slug}`)}
                        >
                            <AddShoppingCartIcon />
                        </Button>

                        <Tooltip
                            id="book-tickets"
                            place="top"
                            effect="solid"
                            style={{ borderRadius: "16px" }}
                        />
                    </CardActions>
                </Box>
            </Card>
        )
    }
}

export default ScreeningItem