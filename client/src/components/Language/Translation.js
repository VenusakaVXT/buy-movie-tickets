// Integrated instructions: https://cloud.google.com/translate/docs/reference/rest

import { useState, useEffect } from "react"
import translate from "@google-cloud/translate"

function Translation() {
    const [language, setLanguage] = useState("US")
    const [translatedContent, setTranslatedContent] = useState({})

    useEffect(() => {
        const detectLanguage = async () => {
            const userLanguage = navigator.language || navigator.languages[0]
            setLanguage(userLanguage)
        }

        detectLanguage()
    }, [])

    useEffect(() => {
        const translateContent = async () => {
            const translations = {}
            const elementsToTranslate =
                document.querySelectorAll("[data-translate]")

            for (const element of elementsToTranslate) {
                const originalText = element.textContent
                const translatedText = await translate(originalText, language)
                translations[element.id] = translatedText
            }

            setTranslatedContent(translations)
        }

        translateContent()
    }, [language])

    const handleLanguageChange = async (newLanguage) => {
        setLanguage(newLanguage)
        const elementsToTranslate =
            document.querySelectorAll("[data-translate]")

        for (const element of elementsToTranslate) {
            const originalText = element.textContent
            const translatedText = await translate(originalText, newLanguage)
            element.textContent = translatedText
        }
    }

    return {
        language,
        translatedContent,
        handleLanguageChange,
    }
}

// Excute
/*
    file ComponentName.js:
    import Translation from "./components/Translation"

    function ComponentName() {
        const { language, translatedContent } = Translation()

        <LanguageMenu handleLanguageChange={handleLanguageChange} />

    <div>
        {Object.entries(translatedContent).map(([id, translatedText]) => (
            <div key={id} id={id} dangerouslySetInnerHTML={{ __html: translatedText }} />
        ))}
    </div>
    }
*/

export default Translation
