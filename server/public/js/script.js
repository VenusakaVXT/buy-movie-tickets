// Handle sidebar (UX)
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId)
    menu.style.display = (menu.style.display === "block") ? "none" : "block"

    const arrow = document.querySelector(`#${menuId} + .menu-item .arrow`)
    arrow.innerHTML = (menu.style.display === "block")
        ? "<i class='bx bx-chevron-up'></i>"
        : "<i class='bx bx-chevron-down'></i>"
}

const menuItems = document.querySelectorAll(".menu-item")

menuItems.forEach(item => {
    item.addEventListener("click", function () {
        menuItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove("active")
            }
        })
        item.classList.toggle("active")
    })
})

// Handle add wasReleased to DB Movie
function setWasReleased(value) {
    document.getElementById("wasReleased").value = value
}

function setWasReleasedDefaultValue() {
    if (!document.getElementById("wasReleased").value) {
        setWasReleased(false)
    }
}

// Handle delete movie
document.addEventListener("DOMContentLoaded", () => {
    let movieId
    let deleteFrm = document.forms["movie-delete-form"]
    let restoreFrm = document.forms["movie-restore-form"]
    let confirmDeleteBtn = document.getElementById("movie-delete-btn")

    $("#deleteMovieModal").on("show.bs.modal", function (e) {
        movieId = $(e.relatedTarget).data("id")
    })

    // Soft delete
    confirmDeleteBtn.addEventListener("click", () => {
        deleteFrm.action = "/movie-screening/" + movieId + "?_method=DELETE"
        deleteFrm.submit()
    })

    $(".restore-btn").click(function (e) {
        e.preventDefault()
        const movieId = $(this).data("id")
        restoreFrm.action = "/movie-screening/" + movieId + "/restore?_method=PATCH"
        restoreFrm.submit()
    })

    // Force delete
    $(".force-delete-btn").click(function (e) {
        e.preventDefault()
        const movieId = $(this).data("id")

        confirmDeleteBtn.addEventListener("click", () => {
            deleteFrm.action = "/movie-screening/" + movieId + "/force-delete?_method=DELETE"
            deleteFrm.submit()
        })
    })

    // Handle click checkbox "select all"
    let checkboxAll = $("#checkbox-all")
    let movieCheckboxItem = $("input[name='movieIds[]']")

    checkboxAll.change(function () {
        const isCheckedAll = $(this).prop("checked") // datatype: Boolean
        movieCheckboxItem.prop("checked", isCheckedAll)
        renderApplyBtn()
    })

    movieCheckboxItem.change(function () {
        const movieIsChecked = $("input[name='movieIds[]']:checked")
        const isCheckedAll = movieCheckboxItem.length === movieIsChecked.length
        checkboxAll.prop("checked", isCheckedAll)
        renderApplyBtn()
    })

    // Handle apply btn
    const renderApplyBtn = () => {
        const checkedCount = $("input[name='movieIds[]']:checked").length

        if (checkedCount > 0) {
            $(".btn-apply").attr("disabled", false)
        } else {
            $(".btn-apply").attr("disabled", true)
        }
    }
})

// Handle toggle sort btn
document.addEventListener("DOMContentLoaded", () => {
    const sortLink = document.querySelector("a[href='?sort&column=title&type=asc']")

    const getUrlParams = (nameParam, url) => {
        nameParam = nameParam.replace(/[\[\]]/g, '\\$&')
        const regex = new RegExp('[?&]' + nameParam + '(=([^&#]*)|&|#|$)')
        const results = regex.exec(url)

        if (!results) return null
        if (!results[2]) return ""

        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    sortLink.addEventListener("click", (e) => {
        e.preventDefault()

        const currentType = getUrlParams("type", sortLink.href)

        if (currentType === "asc") {
            sortLink.innerHTML = "<i class='bx bx-sort-z-a'></i>"
            sortLink.href = "?sort&column=title&type=desc"
        } else {
            sortLink.innerHTML = "<i class='bx bx-sort-a-z'></i>"
            sortLink.href = "?sort&column=title&type=asc"
        }
    })
})

// Handle delete of other Models
function deleteData(model, form, modal) {
    let id
    const deleteFrm = document.forms[form]

    $(modal).on("show.bs.modal", function (e) {
        id = $(e.relatedTarget).data("id")
    })

    document.querySelector(`${modal} #deleteBtn`).addEventListener("click", () => {
        deleteFrm.action = `/${model}/${id}?_method=DELETE`
        deleteFrm.submit()
    })
}

document.addEventListener("DOMContentLoaded", () => {
    deleteData("category-film", "category-delete-form", "#deleteCategoryModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("producer", "producer-delete-form", "#deleteProducerModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("cinema", "cinema-delete-form", "#deleteCinemaModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("cinemaroom", "cinemaroom-delete-form", "#deleteCinemaRoomModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("seat", "seat-delete-form", "#deleteSeatModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("employee", "employee-delete-form", "#deleteEmployeeModal")
})

document.addEventListener("DOMContentLoaded", () => {
    deleteData("screening", "screening-delete-form", "#deleteScreeningModal")
})

// Group models
function handleSelectGroup(element, path) {
    const select = document.getElementById(element)
    const id = select.value

    switch (path) {
        case "cinemaroom":
            window.location.href = `/${path}/table-lists?cinemaId=${id}`
            break
        case "seat":
            window.location.href = `/${path}/table-lists?cinemaRoomId=${id}`
            break
        default:
            alert("Error path...")
            break
    }
}

// AJAX handles ticket cancellations
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".approve-btn").forEach((btn) => {
        btn.addEventListener("click", async function () {
            const id = this.getAttribute("data-id")
            try {
                const res = await fetch(`/booking/cancel-booking/${id}/approve-request`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const result = await res.json()

                if (res.ok) {
                    alert("Booking approved successfully")
                    location.reload()
                } else {
                    alert("Processing error:", result.message)
                }
            } catch (err) {
                alert("Processing error...")
            }
        })
    })

    document.querySelectorAll(".restore-cancel-booking-btn").forEach((btn) => {
        btn.addEventListener("click", async function () {
            const id = this.getAttribute("data-id")
            try {
                const res = await fetch(`/booking/cancel-booking/${id}/restore`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                const result = await res.json()

                if (res.ok) {
                    alert("Booking restored successfully")
                    location.reload()
                } else {
                    alert("Processing error:", result.message)
                }
            } catch (err) {
                alert("Processing error...")
            }
        })
    })
})