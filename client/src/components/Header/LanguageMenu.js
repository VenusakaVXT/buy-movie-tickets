import { useState } from "react"
import { Menu, MenuItem, Button, Typography } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useTranslation } from "react-i18next"

const LanguageMenu = () => {
    const { t, i18n } = useTranslation()
    const languages = [
        { countryCode: "us", langCode: "en", label: t("language.en") },
        { countryCode: "vn", langCode: "vi", label: t("language.vi") }
    ]
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState(
        languages.find(lang => lang.langCode === i18n.language) || languages[0]
    )

    const handleLanguageSelect = (languageCode) => {
        i18n.changeLanguage(languageCode)
        setSelectedLanguage(languages.find(lang => lang.langCode === languageCode))
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
                sx={{
                    pr: 0,
                    "& .css-9odwqc-MuiButtonBase-root-MuiButton-root": {
                        borderColor: "#fff",
                        borderRadius: "5px",
                    },
                    "& .MuiTypography-root": {
                        textTransform: "none",
                        fontSize: "0.8rem",
                    },
                }}
            >
                <Typography>
                    <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${selectedLanguage.countryCode}.png 2x`}
                        src={`https://flagcdn.com/w20/${selectedLanguage.countryCode}.png`}
                        alt=""
                        style={{ marginRight: "8px" }}
                    />
                    {selectedLanguage.langCode === "en"
                        ? "United States" : "Tiếng Việt"} ({selectedLanguage.countryCode.toUpperCase()})
                </Typography>
                {anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.langCode}
                        onClick={() => handleLanguageSelect(language.langCode)}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${language.countryCode}.png 2x`}
                            src={`https://flagcdn.com/w20/${language.countryCode}.png`}
                            alt=""
                            style={{ marginRight: "8px" }}
                        />
                        {language.label} ({language.countryCode.toUpperCase()})
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LanguageMenu