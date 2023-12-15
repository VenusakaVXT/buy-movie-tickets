import React from "react"
import { Box, Link } from "@mui/material"
import MovieIcon from "@mui/icons-material/Movie"
import CopyrightIcon from '@mui/icons-material/Copyright'
import "../../scss/Footer.scss"

const Footer = () => {
    const divArr = Array.from({ length: 16 }, (_, index) => index + 1)

    return (
        <Box className="footer__wrapper">
            <Box className="footer__content">
                <div className="footer__logo">
                    <MovieIcon htmlColor="#e50914" /><p>Buy Movie Tickets</p>
                </div>

                <div className="footer__selection">
                    <div className="footer__selection-item">
                        <h6>Business</h6>
                        <span>Policy</span>
                        <span>Security</span>
                        <span>Introduction</span>
                        <span>Teams</span>
                    </div>

                    <div className="footer__selection-item">
                        <h6>Partner</h6>
                        <span>Cinemas</span>
                        <span>Banking & E-wallet</span>
                        <span>Media</span>
                        <span>Strategy</span>
                    </div>

                    <div className="footer__selection-item">
                        <h6>Procedure</h6>
                        <span>Book Tickets</span>
                        <span>Bank Link</span>
                        <span>Online Payment</span>
                    </div>

                    <div className="footer__selection-item">
                        <h6>Service</h6>
                        <span>News</span>
                        <span>Attendance</span>
                        <span>Offers</span>
                        <span>Price</span>
                        <span>Statistic</span>
                        <span>Download</span>
                    </div>
                </div>
            </Box>

            <Box className="footer__contact">
                <div className="footer__copyright">
                    <CopyrightIcon fontSize="10px" /><span>Copyright by BMT 2021-{new Date().getFullYear()}</span>
                </div>

                <div className="footer__social">
                    <Link 
                        href="https://www.facebook.com/xuantuan.vo.16/" 
                        underline="none"
                        target="_blank"
                        sx={{":hover": { color: "#0866ff !important", borderBottom: "1px solid #0866ff" }}}
                    >
                        Facebook
                    </Link>

                    <Link 
                        href="https://www.instagram.com/_venus78g1/" 
                        underline="none"
                        target="_blank"
                        sx={{":hover": { color: "#f02849 !important", borderBottom: "1px solid #f02849" }}}
                    >
                        Instagram
                    </Link>

                    <Link 
                        href="https://www.tiktok.com/@_venus0105" 
                        underline="none"
                        target="_blank"
                        sx={{":hover": { color: "#800080 !important", borderBottom: "1px solid #800080" }}}
                    >
                        TikTok
                    </Link>

                    <Link 
                        href="https://www.youtube.com/" 
                        underline="none"
                        target="_blank"
                        sx={{":hover": { color: "#ff0000 !important", borderBottom: "1px solid #ff0000" }}}
                    >
                        Youtube
                    </Link>

                    <Link 
                        href="https://github.com/VenusakaVXT" 
                        underline="none"
                        target="_blank"
                        sx={{":hover": { color: "#65676b !important", borderBottom: "1px solid #65676b" }}}
                    >
                        GitHub
                    </Link>
                </div>
            </Box>

            <Box className="footer__decorate">
                {divArr.map(index => (
                    <div key={index} style={{ height: "20px", borderTop: `${index * 2}px solid #ff0000`}}></div>
                ))}
            </Box>
        </Box>
    )
}

export default Footer