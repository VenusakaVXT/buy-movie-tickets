import React, { useState } from "react"
import "../../scss/Banner.scss"
import LoyaltyIcon from "@mui/icons-material/Loyalty"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const banners = [
    "http://localhost:5000/img/banner/banner1.png",
    "http://localhost:5000/img/banner/banner2.png",
    "http://localhost:5000/img/banner/banner3.png",
    "http://localhost:5000/img/banner/banner4.png",
    "http://localhost:5000/img/banner/banner5.png",
    "http://localhost:5000/img/banner/banner6.png",
    "http://localhost:5000/img/banner/banner7.png",
]

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerPage = 5

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + banners.length) % banners.length)
    }

    const handleNext = () => {
        setCurrentIndex((nextIndex) => (nextIndex + itemsPerPage) % banners.length)
    }

    return (
        <div className="banner__wrapper">
            <div className="banner__title">
                <h2><LoyaltyIcon htmlColor="#e50914" /> SPECIAL OFFERS</h2>

                <span className="banner__control">
                    <ArrowBackIosIcon onClick={handlePrev} cursor="pointer" />
                    <ArrowForwardIosIcon onClick={handleNext} cursor="pointer" />
                </span>
            </div>

            <div className="banner__carousel">
                {banners.map((banner, index) => (
                    <img
                        key={index}
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className={
                            Math.floor(index / itemsPerPage) === Math.floor(currentIndex / itemsPerPage) ? "visible" : ""
                        }
                    />
                ))}
            </div>
        </div>
    )
}

export default Banner