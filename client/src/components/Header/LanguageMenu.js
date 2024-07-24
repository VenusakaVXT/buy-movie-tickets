import { useState } from "react"
import { Menu, MenuItem, Button, Typography } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useTranslation } from "react-i18next"

const LanguageMenu = () => {
    const { t, i18n } = useTranslation()
    const languages = [
        { code: "us", label: t("language.us") },
        { code: "vn", label: t("language.vn") }
    ]
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState(
        languages.find(lang => lang.code === i18n.language)
    )

    const handleLanguageSelect = (languageCode) => {
        i18n.changeLanguage(languageCode)
        setSelectedLanguage(languages.find(lang => lang.code === languageCode))
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
                        srcSet={`https://flagcdn.com/w40/${selectedLanguage.code}.png 2x`}
                        src={`https://flagcdn.com/w20/${selectedLanguage.code}.png`}
                        alt=""
                        style={{ marginRight: "8px" }}
                    />
                    {selectedLanguage.code === "us"
                        ? "United States" : "Tiếng Việt"} ({selectedLanguage.code.toUpperCase()})
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
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${language.code}.png 2x`}
                            src={`https://flagcdn.com/w20/${language.code}.png`}
                            alt=""
                            style={{ marginRight: "8px" }}
                        />
                        {language.label} ({language.code.toUpperCase()})
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LanguageMenu