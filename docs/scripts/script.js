document.addEventListener('click', e => {
    const isDropDown = e.target.matches("[data-dropdown-menu]")
    if (!isDropDown && e.target.closest("[data-dropdown]") != null) return;

    let curDropDown;

    if (isDropDown) {
        curDropDown = e.target.closest("[data-dropdown]");
        curDropDown.classList.toggle('active')
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown === curDropDown) return;
        dropdown.classList.remove(".active")
    })
})