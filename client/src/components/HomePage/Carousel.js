import React, { useState, useEffect, useCallback } from "react"
import { Typography, IconButton, Paper, Container, Grid } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import "../../scss/Carousel.scss"

const Carousel = () => {
    const [index, setIndex] = useState(0)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const carousel = [
        {
            slug: "the-fantastic-four-first-steps",
            content: t("carousel.contentCarousel1")
        },
        {
            slug: "ballerina",
            content: t("carousel.contentCarousel2")
        },
        {
            slug: "mission-impossible-the-final-reckoning",
            content: t("carousel.contentCarousel3")
        },
    ]

    const carouselLength = carousel.length
    const handlePrev = () => setIndex((prevIndex) => (prevIndex - 1 + carouselLength) % carouselLength)
    const handleNext = useCallback(() => setIndex((nextIndex) => (nextIndex + 1) % carouselLength), [carouselLength])

    useEffect(() => {
        const interval = setInterval(() => handleNext(), 5000)
        return () => clearInterval(interval)
    }, [handleNext])

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
                    src={`${process.env.REACT_APP_API_URL}/img/slider/${carousel[index].slug}.jpg`}
                    alt={`Slide ${index + 1}`}
                    onClick={() => navigate(`/movie-details/${carousel[index].slug}`)}
                    style={{ cursor: "pointer" }}
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
                                backgroundColor: i === index ? "#fff" : "#808080",
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