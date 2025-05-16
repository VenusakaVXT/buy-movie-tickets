import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoyaltyIcon from "@mui/icons-material/Loyalty"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { useTranslation } from "react-i18next"
import { getPromotionPrograms } from "../../api/promotionProgramApi"
import "../../scss/Banner.scss"

const Banner = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [banners, setBanners] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerPage = 5

    useEffect(() => {
        getPromotionPrograms()
            .then((res) => {
                const promotionProgramsActive = res.promotionPrograms.filter(
                    (program) => program.isActive && new Date(program.endDate) > new Date()
                )
                setBanners(promotionProgramsActive)
            })
            .catch((err) => console.error(err))
    }, [])

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage + banners.length) % banners.length)
    }

    const handleNext = () => {
        setCurrentIndex((nextIndex) => (nextIndex + itemsPerPage) % banners.length)
    }

    return (
        banners && banners.length > 0 ? <div className="banner__wrapper">
            <div className="banner__title">
                <h2>
                    <LoyaltyIcon htmlColor="#e50914" /> {t("homepage.specialOffers").toUpperCase()}
                </h2>

                <span className="banner__control">
                    <ArrowBackIosIcon onClick={handlePrev} cursor="pointer" />
                    <ArrowForwardIosIcon onClick={handleNext} cursor="pointer" />
                </span>
            </div>

            <div className="banner__carousel">
                {banners.map((banner, index) => (
                    <img
                        key={index}
                        src={`${process.env.REACT_APP_API_URL}${banner.image}`}
                        alt={`Banner ${index + 1}`}
                        className={
                            Math.floor(index / itemsPerPage) === Math.floor(currentIndex / itemsPerPage) ? "visible" : ""
                        }
                        onClick={() => navigate(`/promotion-program/${banner.discountCode.toUpperCase()}`)}
                    />
                ))}
            </div>
        </div> : <div style={{ height: 70 }}></div>
    )
}

export default Banner