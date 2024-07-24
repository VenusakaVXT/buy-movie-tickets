import React, { useState, useEffect } from "react"
import { getApiFromBE } from "../../api/movieApi"
import { Box, Card, CardContent, Typography } from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { convertStr } from "../../util"
import "../../scss/Category.scss"

const Category = () => {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        getApiFromBE("category")
            .then((data) => setCategories(data.categories))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div id="category" className="category__wrapper">
            <h2><span>#</span>{t("header.category").toUpperCase()}</h2>

            <Box className="category__grid">
                {categories.map((category, index) => (
                    <div key={index} className="category__item">
                        <h3 className="category__title">
                            <CategoryIcon htmlColor="#e50914" /> {i18n.language === "us"
                                ? `${t(`category.${convertStr(category.category)}`)} Movies`
                                : `Phim ${t(`category.${convertStr(category.category)}`)}`
                            }
                        </h3>

                        <div className="category__movies">
                            {category.movies.map((movie, index) => (
                                <Card
                                    key={index}
                                    className="category__movie-card"
                                    onClick={() => {
                                        const movieTitle = movie.title.toLowerCase()
                                        const path = `/category/${convertStr(category.category)}/${movieTitle}`
                                        const handlePath = path
                                            .replace(/[:,]/g, "")
                                            .replace(/\s+/g, "-")
                                            .replace(/-{2,}/g, "-")
                                        navigate(handlePath)
                                    }}
                                >
                                    <img
                                        width={"100%"}
                                        height={"80%"}
                                        src={`${process.env.REACT_APP_API_URL}${movie.img}`}
                                        alt="film-in-category"
                                    />

                                    <CardContent sx={{ padding: 0 }}>
                                        <Typography className="category__movie-name">
                                            {movie.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </Box>
        </div>
    )
}

export default Category