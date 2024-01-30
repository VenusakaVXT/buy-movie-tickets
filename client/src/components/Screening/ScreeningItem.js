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
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import VideocamIcon from "@mui/icons-material/Videocam"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { Tooltip } from "react-tooltip"
import "../../scss/Screening.scss"

const ScreeningItem = ({ id, title, description, releaseDate, time, trailerId, displayType }) => {
    const navigate = useNavigate()

    const handlePath = title
        .toLowerCase()
        .replace(/[:,]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-{2,}/g, "-")

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
                    onClick={() => navigate(`/movie-details/${handlePath}`)}
                />

                <CardContent sx={{ padding: 1 }}>
                    <Typography
                        className="title-height"
                        gutterBottom
                        variant="h5"
                        component="div"
                        onClick={() => navigate(`/movie-details/${handlePath}`)}
                    >
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <VideocamIcon fontSize="1rem" className="customic" />
                        {new Date(releaseDate).toDateString()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <AccessTimeIcon fontSize="0.8rem" className="customic" />{`Time: ${time}`}
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
                        onClick={() => navigate(`/booking/${handlePath}`)}
                    >
                        Booking
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
                        onClick={() => navigate(`/movie-details/${handlePath}`)}
                    />
                </Box>

                <Box padding={"8px 16px"}>
                    <CardContent className="p0">
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`/movie-details/${handlePath}`)}
                            color={"#fff"}
                        >
                            {title}
                        </Typography>

                        <Typography className="desciption-hw" variant="body2" color="#f2f2f2">
                            {description}
                        </Typography>

                        <Box display={"flex"} margin={"8px 0"}>
                            <Typography variant="body2" color="#f2f2f2" marginRight={3}>
                                <VideocamIcon fontSize="1rem" className="customic" />
                                {`Premiere: ${new Date(releaseDate).toDateString()}`}
                            </Typography>

                            <Typography variant="body2" color="#f2f2f2">
                                <AccessTimeIcon fontSize="0.8rem" className="customic" />{`Time: ${time}`}
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
                            data-tooltip-content="Favorite"
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
                            data-tooltip-content="Book Tickets"
                            onClick={() => navigate(`/booking/${handlePath}`)}
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
