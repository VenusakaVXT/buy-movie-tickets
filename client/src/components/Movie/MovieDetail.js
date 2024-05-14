import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getMovieDetail } from "../../api/movieApi"
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button
} from "@mui/material"
import "../../scss/MovieDetail.scss"
import "../../scss/App.scss"

const MovieDetail = () => {
    const [movie, setMovie] = useState()
    const slug = useParams().slug

    useEffect(() => {
        getMovieDetail(slug)
            .then((res) => setMovie(res.movie))
            .catch((err) => console.error(err))
    }, [slug])

    return (
        <>
            {movie && (
                <Box
                    sx={{
                        width: "100%",
                        height: "1024px",
                        backgroundImage: `
                            url(https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))
                        `,
                        backgroundSize: "100% 70%, 100% 100%",
                        backgroundPosition: "0% 0%, 0% 100%",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <Box display={"flex"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
                        <Box
                            sx={{
                                width: 220,
                                height: 140,
                                border: "2px solid #fff",
                                borderRadius: 2,
                                overflow: "hidden"
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={`https://img.youtube.com/vi/${movie.trailerId}/maxresdefault.jpg`}
                                alt={movie.title}
                                sx={{ width: "100%", height: "100%" }}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: 901,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                ml: 5
                            }}
                        >
                            <CardContent>
                                <Typography className="text-border" variant="h4" component="h2">
                                    {movie.title}
                                </Typography>

                                <Typography className="text-border" variant="body1">{movie.description}</Typography>

                                <Typography className="text-border" variant="body1">
                                    Director: {movie.director}
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    Content Writter: {movie.contentWritter}
                                </Typography>

                                <Typography className="text-border" variant="body1" display={"flex !important"}>
                                    Actors: {
                                        movie.actors !== "" ?
                                            movie.actors.split(",").map(actor => (
                                                <a
                                                    className="text-border actor-info"
                                                    href={`https://vi.wikipedia.org/wiki/${actor.replace(/ /g, "_")}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {actor.trim()}
                                                </a>
                                            )) : "Not yet published"
                                    }
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    Category: {
                                        movie.category ? movie.category.map(c => c.category).join(", ") : "none"
                                    }
                                </Typography>

                                <Typography className="text-border" variant="body1">
                                    Release Date: {movie.releaseDate !== "" ? movie.releaseDate : "Not yet published"}
                                </Typography>

                                <Typography className="text-border" variant="body1">Time: {movie.time} minute</Typography>

                                <Typography className="text-border" variant="body1">
                                    Producer: {
                                        movie.producer ? movie.producer.map(p => p.producerName).join(", ") : "none"
                                    }
                                </Typography>
                            </CardContent>
                        </Box>
                    </Box>

                    <Box display={"flex"} justifyContent={"center"} marginBottom={"24px"}>
                        <Card
                            sx={{
                                width: 560,
                                height: 315,
                                backgroundColor: "rgba(255, 255, 255, 0.7)",
                                backdropFilter: "blur(30px)",
                                borderRadius: 2,
                            }}
                        >
                            <CardMedia
                                component="iframe"
                                src={`https://www.youtube.com/embed/${movie.trailerId}?controls=1&hd=1&fs=1&rel=0`}
                                alt={movie.title}
                                title={movie.title}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </Card>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <Button className="btn" variant="contained" LinkComponent={Link} to={`/booking/${slug}`}>
                            Booking
                        </Button>
                        <Button className="btn" variant="contained" onClick={() => {
                            window.scrollBy({ top: 150, left: 0, behavior: "smooth" })
                        }}>
                            See reviews
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "30px 70px",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h4" color={"#e50914"} fontFamily={"600"}>
                            Feedbacks
                        </Typography>
                    </Box>
                </Box>
            )}
        </>
    )
}

export default MovieDetail