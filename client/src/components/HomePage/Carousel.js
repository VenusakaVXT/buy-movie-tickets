import React, { useState, useEffect } from "react"
import { Typography, IconButton, Paper, Container, Grid } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import "../../scss/Carousel.scss"

const carousel = [
    {
        src: `${process.env.REACT_APP_API_URL}/img/slider/avatar.jpeg`,
        content:
            "Avatar: The Way Of Water after 13 years, the audience's wait is truly worth it",
    },
    {
        src: `${process.env.REACT_APP_API_URL}/img/slider/ant-man-quantuminia.jpg`,
        content:
            "Ant-Man 3 expands the Marvel Cinematic Universe, bringing audiences to the quantum world - a land that has not been introduced much in previous films.",
    },
    {
        src: `${process.env.REACT_APP_API_URL}/img/slider/theflash2.jpg`,
        content:
            "The Flash 2, Barry will face a new threat from a parallel universe in the form of Speedster Zoom",
    },
]

const Carousel = () => {
    const [index, setIndex] = useState(0)

    const handlePrev = () => {
        setIndex(
            (prevIndex) => (prevIndex - 1 + carousel.length) % carousel.length,
        )
    }

    const handleNext = () => {
        setIndex((nextIndex) => (nextIndex + 1) % carousel.length)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Container className="carousel__wrapper">
            <Grid className="carousel__grid" container>
                <IconButton
                    className="carousel__control carousel__prev-btn"
                    onClick={handlePrev}
                >
                    <KeyboardArrowLeft className="carousel__control-item" />
                </IconButton>

                <img
                    className="carousel__img"
                    src={carousel[index].src}
                    alt={`Slide ${index + 1}`}
                />

                <IconButton
                    className="carousel__control carousel__next-btn"
                    onClick={handleNext}
                >
                    <KeyboardArrowRight className="carousel__control-item" />
                </IconButton>

                <div className="carousel__tick">
                    {carousel.map((img, i) => (
                        <Paper
                            className="carousel__tick-item"
                            key={i}
                            style={{
                                backgroundColor:
                                    i === index ? "#fff" : "#808080",
                            }}
                        />
                    ))}
                </div>

                <Typography className="carousel__content" container>
                    {carousel[index].content}
                </Typography>
            </Grid>
        </Container>
    )
}

export default Carousel