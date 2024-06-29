import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config()

const algorithm = "aes-256-cbc"
const key = crypto.scryptSync(process.env.SECRET_KEY, "salt", 32)

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}:${encrypted}`
}

export const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex")
    let decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
}

export const decryptedPassword = decrypt(process.env.SYSTEM_EMAIL_PASSWORD)