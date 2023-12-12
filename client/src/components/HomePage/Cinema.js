import React from "react"
import { Tooltip } from "react-tooltip"
import "../../scss/Cinema.scss"

const Cinema = () => {
    const logoCinemas = [
        {
            name: "CGV Cinema",
            logo: "http://localhost:5000/img/cinema/logo1.png",
        },
        {
            name: "Lotte Cinema",
            logo: "http://localhost:5000/img/cinema/logo2.png",
        },
        {
            name: "Glaxy Cinema",
            logo: "http://localhost:5000/img/cinema/logo3.png",
        },
        {
            name: "BHD Star Cineplex",
            logo: "http://localhost:5000/img/cinema/logo4.png",
        },
        {
            name: "Beta Cinemas",
            logo: "http://localhost:5000/img/cinema/logo5.png",
        },
        {
            name: "Cine Star",
            logo: "http://localhost:5000/img/cinema/logo6.png",
        },
        {
            name: "MegaGS Cinema",
            logo: "http://localhost:5000/img/cinema/logo7.png",
        },
        {
            name: "DCINE",
            logo: "http://localhost:5000/img/cinema/logo8.png"
        }
    ]

    return (
        <div id="cinema" className="cinema__wrapper" style={{ height: "700px" }}>
            <h2><span>#</span>CINEMA</h2>

            <p>
                Buy Movie Tickets is the most reputable online movie ticket
                selling system today not only in Vietnam but also around the world.
                Instead of other online movie ticketing systems that only manage one cinema system.
                With the reputation of Buy Movie Tickets, it is the place to manage and control ticket sales
                and publicize screenings for many theater systems around the world. Below are the theater systems
                that have accompanied Buy Movie Tickets, we sincerely thank you.
                Buy Movie Tickets reputation creates the brand and trust of all cinema systems and customers globally.
            </p>

            <div className="cinema__logo-list">
                {logoCinemas.map((cinema, index) => (
                    <div className="cinema__logo-item">
                        <img
                            width={"60%"}
                            height={"60%"}
                            key={index}
                            src={cinema.logo}
                            alt={`Logo ${cinema.name}`}
                            data-tooltip-content={cinema.name}
                            data-tooltip-id={`tooltip${index}`}
                        />

                        <Tooltip 
                            id={`tooltip${index}`} 
                            place="top" 
                            effect="solid" 
                            style={{background: "#868686", borderRadius: "16px"}}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cinema