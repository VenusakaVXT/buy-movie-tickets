import { useState } from "react"
import { Menu, MenuItem, Button, Typography } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

const languages = [
    {
        code: "US",
        label: "United States",
        suggested: true,
    },
    {
        code: "VN",
        label: "Vietnamese",
    },
]

const LanguageMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedLanguage, setSelectedLanguage] = useState(
        languages.find((lang) => lang.suggested) || languages[0],
    )

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language)
        handleClose()
    }

    return (
        <>
            <Button
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
                sx={{
                    width: 180,
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
                        srcSet={`https://flagcdn.com/w40/${selectedLanguage.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${selectedLanguage.code.toLowerCase()}.png`}
                        alt=""
                        style={{ marginRight: "8px" }}
                    />
                    {selectedLanguage.label} ({selectedLanguage.code})
                </Typography>
                <ArrowDropDownIcon />
            </Button>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageSelect(language)}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${language.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${language.code.toLowerCase()}.png`}
                            alt=""
                            style={{ marginRight: "8px" }}
                        />
                        {language.label} ({language.code})
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LanguageMenu
