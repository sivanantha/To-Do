"use strict";

(function () {
  let dateContainer = document.querySelector(".date-container");
  let newListInput = document.querySelector(".new-list-container input");
  let sidebar = document.querySelector(".sidebar-left");
  let sidebarOpenButton = document.getElementById("sidebar-open-btn");
  let sidebarCloseButton = document.getElementById("sidebar-close-btn");

  function init() {
    bindEventListeners();
    setTodayDate();
  }

  function bindEventListeners() {
    addListener(sidebarOpenButton, "click", openSideBar);
    addListener(sidebarCloseButton, "click", closeSideBar);
    addListener(newListInput, "keyup", createList);
  }

  function addListener(element, event, listener) {
    element.addEventListener(event, listener);
  }

  function openSideBar() {
    sidebar.style.width = "21vw";
    sidebarOpenButton.style.display = "none";
  }

  function closeSideBar() {
    sidebar.style.width = "0px";
    sidebarOpenButton.style.display = "inline-block";
  }

  function setTodayDate() {
    dateContainer.innerHTML = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function createList() {}

  init();
})();
