import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadLocale = (locale) => {
    const filePath = path.join(__dirname, "..", "locales", `${locale}.json`)

    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    }

    return null
}

export const getLocalizedText = (locale, key, replacements = {}) => {
    const translations = loadLocale(locale)
    if (!translations) return key

    const keys = key.split(".")
    let result = translations

    for (let k of keys) {
        result = result ? result[k] : key
    }

    for (let placeholder in replacements) {
        result = result.replace(`{{${placeholder}}}`, replacements[placeholder])
    }

    return result
}

// const locales = {}

// const loadLocales = () => {
//     const localesDir = path.join(__dirname, "..", "locales")
//     const files = fs.readdirSync(localesDir)

//     files.forEach((file) => {
//         const locale = path.basename(file, ".json")
//         const filePath = path.join(localesDir, file)
//         locales[locale] = JSON.parse(fs.readFileSync(filePath, "utf8"))
//     })
// }

// loadLocales()

// export const getLocalizedText = (locale, key, params = {}) => {
//     const keys = key.split(".")
//     let text = locales[locale]

//     keys.forEach((k) => {
//         text = text ? text[k] : null
//     })

//     if (text && typeof text === "string") {
//         Object.keys(params).forEach((param) => {
//             const regex = new RegExp(`{{${param}}}`, "g")
//             text = text.replace(regex, params[param])
//         })
//     }

//     return text
// }