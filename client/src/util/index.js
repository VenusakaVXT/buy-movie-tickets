export const getEndTime = (startTime, minutesPlus) => {
    const [hoursStr, minutesStr] = startTime.split(":")
    const hours = parseInt(hoursStr)
    const minutes = parseInt(minutesStr)

    const totalMinutes = hours * 60 + minutes + minutesPlus
    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = totalMinutes % 60

    const newHoursStr = newHours < 10 ? "0" + newHours : "" + newHours
    const newMinutesStr = newMinutes < 10 ? "0" + newMinutes : "" + newMinutes

    return `${newHoursStr}:${newMinutesStr}`
}

export const handleSeatArr = (seatArr) => {
    const seats = seatArr.map((seat) => `${seat.rowSeat}-${seat.seatNumber.padStart(3, "0")}`)
    return seats.join(", ")
}