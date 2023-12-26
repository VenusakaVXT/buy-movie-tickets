import React from "react"
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import "../../scss/Screening.scss"

const ScreeningItem = ({ title, releaseDate, trailerId, id }) => {
    const navigate = useNavigate()

    const handlePath = title
        .toLowerCase()
        .replace(/[:,]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-{2,}/g, "-")

    return (
        <Card
            sx={{
                margin: 2,
                width: 200,
                height: 284,
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
                    {new Date(releaseDate).toDateString()}
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
}

export default ScreeningItem
