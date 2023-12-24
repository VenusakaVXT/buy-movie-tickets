import React, { useState, useEffect } from "react"
import getApiFromBE from "../../api/movieApi"
import { Tooltip } from "react-tooltip"
import "../../scss/Cinema.scss"

const Cinema = () => {
    const [cinemas, setCinemas] = useState([])

    useEffect(() => {
        getApiFromBE("cinema")
            .then((data) => setCinemas(data.cinemas))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div id="cinema" className="cinema__wrapper">
            <h2>
                <span>#</span>CINEMA
            </h2>

            <p>
                Buy Movie Tickets is the most reputable online movie ticket
                selling system today not only in Vietnam but also around the
                world. Instead of other online movie ticketing systems that only
                manage one cinema system. With the reputation of Buy Movie
                Tickets, it is the place to manage and control ticket sales and
                publicize screenings for many theater systems around the world.
                Below are the theater systems that have accompanied Buy Movie
                Tickets, we sincerely thank you. Buy Movie Tickets reputation
                creates the brand and trust of all cinema systems and customers
                globally.
            </p>

            <div className="cinema__logo-list">
                {cinemas.map((cinema, index) => (
                    <div className="cinema__logo-item" key={index}>
                        <img
                            width={"60%"}
                            height={"60%"}
                            src={cinema.logo}
                            alt={`Logo ${cinema.name}`}
                            data-tooltip-content={cinema.name}
                            data-tooltip-id={`tooltip${index}`}
                        />

                        <Tooltip
                            id={`tooltip${index}`}
                            place="top"
                            effect="solid"
                            style={{
                                background: "#868686",
                                borderRadius: "16px",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cinema
