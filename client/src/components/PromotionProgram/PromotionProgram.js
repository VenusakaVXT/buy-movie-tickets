import React, { useEffect, useState, useRef } from "react"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { getPromotionProgramByDiscountCode } from "../../api/promotionProgramApi"
import { useParams, useNavigate } from "react-router-dom"
import Loading from "../Loading/Loading"

const PromotionProgram = () => {
    const [promotionProgram, setPromotionProgram] = useState({})
    const [loading, setLoading] = useState(false)
    const [showFullContent, setShowFullContent] = useState(false)
    const [isContentOverflow, setIsContentOverflow] = useState(false)
    const contentRef = useRef(null)
    const discountCode = useParams().discountCode
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        setLoading(true)
        getPromotionProgramByDiscountCode(discountCode)
            .then((res) => setPromotionProgram(res.promotionProgram))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))
    }, [discountCode])

    useEffect(() => {
        if (contentRef.current) {
            const maxHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) * 3
            setIsContentOverflow(contentRef.current.scrollHeight > maxHeight)
        }
    }, [promotionProgram.content])

    const toggleContent = () => setShowFullContent((prev) => !prev)

    const handleDisplayDate = (date) => {
        return i18n.language === "en" ? date : new Date(date).toLocaleDateString("vi-VN")
    }

    return (
        promotionProgram && !loading ? (
            <Box className="wrapper">
                <Box className="breadcrumb" margin={0}>
                    <Typography className="breadcrumb__item" onClick={() => navigate("/")}>
                        {t("header.home")}
                    </Typography>
                    <Typography className="breadcrumb__item disable">
                        {t("promotionProgram.title")}
                    </Typography>
                    <Typography className="breadcrumb__item">
                        {promotionProgram.programName}
                    </Typography>
                </Box>

                <Typography textAlign={"center"} color={"#fff"} fontSize={30} fontWeight={600} marginTop={3}>
                    {promotionProgram.programName}
                </Typography>

                <Box color={"#fff"} fontSize={20} fontWeight={600} marginTop={2}>
                    <Typography>
                        {t("promotionProgram.discountCode")}: {promotionProgram.discountCode}
                    </Typography>
                    <Typography>
                        {t("promotionProgram.content")}:{" "}
                        <Box component="span" sx={{ display: "inline" }}>
                            <Box
                                ref={contentRef}
                                component="span"
                                sx={{
                                    display: showFullContent ? "inline" : "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    whiteSpace: showFullContent ? "normal" : "initial",
                                    textAlign: "justify"
                                }}
                            >
                                {promotionProgram.content}
                            </Box>
                            {isContentOverflow && (
                                <Box
                                    component="span"
                                    onClick={toggleContent}
                                    sx={{
                                        cursor: "pointer",
                                        color: "#1976d2",
                                        transition: "color 0.2s",
                                        "&:hover": {
                                            color: "#e50914",
                                            textDecoration: "underline",
                                        }
                                    }}
                                >
                                    [{showFullContent ? t("shorten") : t("seeMore")}]
                                </Box>
                            )}
                        </Box>
                    </Typography>
                    <Typography>
                        {t("promotionProgram.startDate")}: {handleDisplayDate(promotionProgram.startDate)}
                    </Typography>
                    <Typography>
                        {t("promotionProgram.endDate")}: {handleDisplayDate(promotionProgram.endDate)}
                    </Typography>
                    <Typography>
                        {t("promotionProgram.percentReduction")}: {promotionProgram.percentReduction}%
                    </Typography>
                    <Typography>
                        {t("promotionProgram.maxMoneyAmount")}: {promotionProgram.maxMoneyAmount}
                    </Typography>
                    {promotionProgram.condition && <Typography>
                        {t("promotionProgram.condition")}: {promotionProgram.condition}
                    </Typography>}
                </Box>

                <Box marginTop={2}>
                    <img
                        src={`${process.env.REACT_APP_API_URL}${promotionProgram.image}`}
                        alt={promotionProgram.programName}
                        width={"100%"}
                        height={"auto"}
                    />
                </Box>
            </Box>
        ) : <Loading />
    )
}

export default PromotionProgram