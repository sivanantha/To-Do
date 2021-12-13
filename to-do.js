"use strict";

(function () {
  const dateContainer = document.querySelector(".date-container");
  const newListInput = document.querySelector(".newlist-container input");
  const newListContainer = document.querySelector(".newlist-container");
  const sidebar = document.querySelector(".left-column");
  const sidebarOpenButton = document.getElementById("sidebar-open-btn");
  const sidebarCloseButton = document.getElementById("sidebar-close-btn");
  const taskDetailsPanel = document.querySelector(".right-column");
  const taskPanelCloseButton = document.getElementById("task-panel-close-btn");
  const taskInput = document.querySelector(
    ".task-list-container .add-task input"
  );
  const myDay = document.getElementById("my-day");
  const important = document.getElementById("important");
  const tasksContainer = taskInput.parentNode.nextElementSibling;
  const tasks = new Map();
  tasks.set("myDay", []);
  tasks.set("important", []);
  let currentPage = "myDay";
  function init() {
    bindEventListeners();
    setTodayDate();
  }

  function bindEventListeners() {
    addListener(sidebarOpenButton, "click", openSideBar);
    addListener(sidebarCloseButton, "click", closeSideBar);
    addListener(taskPanelCloseButton, "click", closeTaskPanel);
    addListener(newListInput, "keyup", createList);
    addListener(taskInput, "keyup", createTask);
    addListener(myDay, "click", showMyDay);
    addListener(important, "click", showImportant);
  }

  function addListener(element, event, listener) {
    element.addEventListener(event, listener);
  }

  function getSnippet(snippetName) {
    request = new XMLHttpRequest();
    request.open("GET", `snippets/${snippetName}`, true);
    request.send();
    return request.responseText;
  }

  function openSideBar() {
    sidebar.style.width = "21vw";
    sidebarOpenButton.style.display = "none";
  }

  function closeSideBar() {
    sidebar.style.width = "0px";
    sidebarOpenButton.style.display = "inline-block";
  }

  function closeTaskPanel() {
    taskDetailsPanel.style.width = "0px";
  }

  function setTodayDate() {
    dateContainer.innerText = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function createList(key) {
    if (key.keyCode === 13) {
      let listName = newListInput.value;
      tasks.push(listName, []);
      addListToPage(listName);
    }
  }

  function addListToPage(listName) {
    let div = document.createElement("div");
    let icon = document.createElement("i");
    let link = document.createElement("a");
    div.setAttribute("dir", "ltr");
    icon.classList.add("icon", "ms-Icon", "ms-Icon--BulletedList2");
    div.appendChild(icon);
    link.appendChild(document.createTextNode(listName));
    div.appendChild(link);
    newListContainer.parentNode.insertBefore(div, newListContainer);
    newListInput.value = "";
  }

  function createTask(key) {
    if (key.keyCode === 13) {
      let taskName = taskInput.value;
      console.log(tasks.get(currentPage));
      tasks.get(currentPage).push({name: taskName, steps:[]});
      addTaskToPage(taskName);
    }
  }

  function addTaskToPage(taskName) {
    let div = document.createElement("div");
    let radioButton = document.createElement("i");
    let starIcon = document.createElement("i");
    let title = document.createElement("span");
    radioButton.classList.add("icon", "ms-Icon", "ms-Icon--RadioBtnOff");
    starIcon.classList.add("icon", "ms-Icon", "ms-Icon--FavoriteStar");
    div.classList.add("task");
    div.appendChild(radioButton);
    title.appendChild(document.createTextNode(taskName));
    div.appendChild(title);
    div.appendChild(starIcon);
    addListener(title, "click", openTaskPanel);
    taskInput.parentNode.nextElementSibling.insertBefore(
      div,
      tasksContainer.firstChild
    );
    taskInput.value = "";
  }

  function openTaskPanel() {
    taskDetailsPanel.style.width = "25%";
  }

  function showMyDay() {
    let myDayTasks = tasks.get("myDay");
    currentPage = "myDay";
    console.log(myDayTasks);
    for (let task of myDayTasks) {
      addTaskToPage(task.name);
    }
  }

  function showImportant() {
    let importantTasks = tasks.get("important");
    currentPage = "important";
    console.log(importantTasks);
    for (let task of myDayTasks) {
      addTaskToPage(task.name);
    }
  }

  init();
})();
