import React, { useState, useEffect } from "react"
import {
    Typography,
    IconButton,
    Paper,
    Container,
    Grid
} from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import "../../scss/Carousel.scss"

const images = [
    {
        src: "https://gugimages.s3.us-east-2.amazonaws.com/wp-content/uploads/2022/12/30214953/Avatar-2-poster-600x337.jpeg",
        content: "Avatar: The Way Of Water after 13 years, the audience's wait is truly worth it"
    },
    {
        src: "https://venusakavxt.github.io/movie-news/assets/image/ant-man-quantuminia.jpg",
        content: "Ant-Man 3 expands the Marvel Cinematic Universe, bringing audiences to the quantum world - a land that has not been introduced much in previous films."
    },
    {
        src: "https://venusakavxt.github.io/movie-news/assets/image/theflash2.jpg",
        content: "The Flash 2, Barry will face a new threat from a parallel universe in the form of Speedster Zoom"
    },
]

const Carousel = () => {
    const [index, setIndex] = useState(0)

    const handlePrev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length)
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
                <IconButton className="carousel__control carousel__prev-btn" onClick={handlePrev}>
                    <KeyboardArrowLeft className="carousel__control-item" />
                </IconButton>

                <img
                    className="carousel__img" src={images[index].src} alt={`Slide ${index + 1}`}
                />

                <IconButton className="carousel__control carousel__next-btn" onClick={handleNext}>
                    <KeyboardArrowRight className="carousel__control-item" />
                </IconButton>

                <div className="carousel__tick">
                    {images.map((img, i) => (
                        <Paper 
                            className="carousel__tick-item" 
                            key={i} 
                            style={{ backgroundColor: i === index ? "#fff" : "#808080" }} 
                        />
                    ))}
                </div>

                <Typography className="carousel__content" container>
                    {images[index].content}
                </Typography>
            </Grid>
        </Container>
    )
}

export default Carousel
