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

function toggleTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId)
    tooltip.style.display = (tooltip.style.display === "block") ? "none" : "block"
}

// Handle add wasReleased to DB Movie
function setWasReleased(value) {
    document.getElementById("wasReleased").value = value
}

function setWasReleasedDefaultValue() {
    if (!document.getElementById("wasReleased").value) {
        setWasReleased(false)
    }
}

// Handle input data into arrays
// function processArrayInput(inputId) {
//     const inputEl = document.getElementById(inputId)
//     const inputVal = inputEl.value
//     const valueArr = inputVal.split(",").map(item => item.trim())
//     inputEl.value = valueArr
// }

// document.getElementById("frm-add-movie").addEventListener("submit", () => {
//     processArrayInput("director")
//     processArrayInput("contentWritter")
//     processArrayInput("actors")
//     processArrayInput("category")
// })

// Handle wasReleased when accessing data in the edit form
// document.addEventListener("DOMContentLoaded", () => {
//     const wasReleasedValue = 
//     document.querySelector("#frm-update-movie #wasReleased").getAttribute("data-was-released")

//     if (wasReleasedValue === true) {
//         document.querySelector("#frm-update-movie #already").checked = true
//     } else {
//         document.querySelector("#frm-update-movie #notyet").checked = true
//     }

//     setWasReleased(wasReleasedValue == true)
// })

// Handle delete movie
document.addEventListener("DOMContentLoaded", () => {
    let movieId
    let deleteFrm = document.forms["movie-delete-form"]
    // let containerFrm = document.forms["container-form"]

    $("#deleteMovieModal").on("show.bs.modal", function(e) {
        movieId = $(e.relatedTarget).data("id")
    })

    document.getElementById("movie-delete-btn").addEventListener("click", () => {
        deleteFrm.action = "/movie-screening/" + movieId + "?_method=DELETE"
        deleteFrm.submit()
    })
})