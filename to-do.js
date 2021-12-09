let sidebar = document.querySelector(".sidebar-left");
let sidebarOpenButton = document.getElementById("sidebar-open-btn");

(function() {
    let today = new Date().toLocaleDateString("en-us",{weekday: "long", month: "long", day:"numeric"});
    document.querySelector(".date-container").innerHTML = today;
})();

function openSideBar() {
    sidebar.style.width = "27%";
    sidebarOpenButton.style.display = "none";

}

function closeSideBar() {
    sidebar.style.width = "0px";
    sidebarOpenButton.style.display = "inline-block";
}