import React from "react"
import { Box, Link } from "@mui/material"
import { useTranslation } from "react-i18next"
import MovieIcon from "@mui/icons-material/Movie"
import CopyrightIcon from "@mui/icons-material/Copyright"
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward"
import "../../scss/Footer.scss"

const Footer = () => {
    const { t } = useTranslation()
    const footer = t("footer", { returnObjects: true })
    const socialNetworks = [
        { name: "Facebook", href: "https://www.facebook.com/xuantuan.vo.16/", color: "#0866ff" },
        { name: "Instagram", href: "https://www.instagram.com/_venus78g1/", color: "#f02849" },
        { name: "Tiktok", href: "https://www.tiktok.com/@_venus0105/", color: "#800080" },
        { name: "Youtube", href: "https://www.youtube.com/", color: "#ff0000" },
        { name: "Github", href: "https://github.com/VenusakaVXT/", color: "#65676b" }
    ]
    const divArr = Array.from({ length: 16 }, (_, index) => index + 1)

    return (
        <Box className="footer__wrapper">
            <Box className="footer__content">
                <Box className="footer__logo">
                    <MovieIcon htmlColor="#e50914" />
                    <p>Buy Movie Tickets</p>
                </Box>

                <Box className="footer__selection">
                    {Object.keys(footer).map((key, keyIndex) => (
                        key.startsWith("title") && (
                            <Box className="footer__selection-item" key={keyIndex}>
                                <h6>{footer[key]}</h6>
                                {footer[`col${key.slice(-1)}`].map((col, colIndex) => (
                                    <span key={colIndex}>
                                        {col.includes("externalLink") ? (
                                            <>
                                                {col.split(" externalLink")[0]}
                                                <ArrowOutwardIcon fontSize="10px" />
                                            </>
                                        ) : col}
                                    </span>
                                ))}
                            </Box>
                        )
                    ))}
                </Box>
            </Box>

            <Box className="footer__contact">
                <div className="footer__copyright">
                    <CopyrightIcon fontSize="10px" />
                    <span>{t("footer.copyright", { nowYear: new Date().getFullYear() })}</span>
                </div>

                <div className="footer__social">
                    {socialNetworks.map((item) => (
                        <Link
                            href={item.href}
                            underline="none"
                            target="_blank"
                            sx={{
                                ":hover": {
                                    color: `${item.color} !important`,
                                    borderBottom: `1px solid ${item.color}`,
                                },
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </Box>

            <Box className="footer__decorate">
                {divArr.map((index) => (
                    <div
                        key={index}
                        style={{
                            height: "20px",
                            borderTop: `${index * 2}px solid #ff0000`,
                        }}
                    ></div>
                ))}
            </Box>
        </Box>
    )
}

export default Footer