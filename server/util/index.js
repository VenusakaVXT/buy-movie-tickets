export const isValidEndDate = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return end >= start
}