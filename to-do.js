let sidebar = document.querySelector(".sidebar-left");
let sidebarOpenButton = document.getElementById("sidebar-open-btn");

function openSideBar() {
    sidebar.style.width = "25%";
    sidebarOpenButton.style.display = "none";

}

function closeSideBar() {
    sidebar.style.width = "0px";
    sidebarOpenButton.style.display = "inline-block";
}