import React from "react"
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button
} from "@mui/material"
import "../../scss/Screening.scss"

const ScreeningItem = ({ title, releaseDate, posterUrl, id }) => {
    return (
        <Card sx={{
            margin: 2,
            width: 250,
            height: 380,
            borderRadius: 5,
            ":hover": {
                boxShadow: "10px 10px 20px #ccc"
            }
        }}>
            <img height={"50%"} width={"100%"} src="https://img.youtube.com/vi/4k2verGRZNw/maxresdefault.jpg" alt={title} />

            <CardContent>
                <Typography className="title-height" gutterBottom variant="h5" component="div">
                    {title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {new Date(releaseDate).toDateString()}
                </Typography>
            </CardContent>

            <CardActions>
                <Button sx={{
                    margin: "auto",
                    background: "#1a1b1e",
                    color: "#fff",
                    width: "100%",
                    ":hover": {
                        background: "#e50914"
                    }
                }}>
                    Booking
                </Button>
            </CardActions>
        </Card>
    )
}

export default ScreeningItem