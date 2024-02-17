const sortMiddleware = () => {
    const sortByTitle = (movies, sortOrder) => {
        return movies.sort((a, b) => {
            const titleA = a.title.toUpperCase()
            const titleB = b.title.toUpperCase()

            if (sortOrder === "asc") {
                return titleA.localeCompare(titleB)
            } else {
                return titleB.localeCompare(titleA)
            }
        })
    }
}

export default sortMiddleware