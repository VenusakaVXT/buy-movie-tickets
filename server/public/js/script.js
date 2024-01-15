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