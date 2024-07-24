import React, { useState, useEffect } from "react"
import { getApiFromBE } from "../../api/movieApi"
import { Tooltip } from "react-tooltip"
import { useTranslation } from "react-i18next"
import "../../scss/Cinema.scss"

const Cinema = () => {
    const [cinemas, setCinemas] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        getApiFromBE("cinema")
            .then((data) => setCinemas(data.cinemas))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div id="cinema" className="cinema__wrapper">
            <h2><span>#</span>{t("header.cinema").toUpperCase()}</h2>
            <p>{t("homepage.systemDescription")}</p>

            <div className="cinema__logo-list">
                {cinemas.map((cinema, index) => (
                    <div className="cinema__logo-item" key={index}>
                        <img
                            width={"60%"}
                            height={"60%"}
                            src={`${process.env.REACT_APP_API_URL}/${cinema.logo}`}
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