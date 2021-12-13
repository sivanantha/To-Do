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
  const createStepInput = document.querySelector(".add-steps input");
  const taskPanel = document.querySelector(".right-column");
  const stepsContainer = document.querySelector(".steps-container");
  const middleColumn = document.querySelector(".middle-column");
  const tasks = new Map();
  tasks.set("myDay", []);
  tasks.set("important", []);
  let currentPage = "myDay";
  
  function init() {
    showMyDay();
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
    addListener(tasksContainer, "click", openTaskPanel);
    addListener(createStepInput, "keyup", createStep);
  }

  function addListener(element, event, listener) {
    element.addEventListener(event, listener);
  }

  function getSnippet(snippetName, handler, parameter) {
    let request = new XMLHttpRequest();
    request.open("GET", `snippets/${snippetName}.html`, true);
    request.responseType = "text";
    request.onload = () => {
      handler(request.responseText, parameter);
    }
    request.send();
    return request;
  }

  function insertHtml(parent, html) {
    parent.innerHTML = html;
  }

  function insertProperty(html, propertyName, propertyValue) {
    var propertyToReplace = "{{" + propertyName + "}}";
    html = html
      .replace(new RegExp(propertyToReplace, "g"), propertyValue);
    return html;
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
      getSnippet("task-snippet", addTaskToPage);
    }
  }

  function addTaskToPage(templateHtml) {
    let html = "";
    for (let task of tasks.get(currentPage)) {
      html = insertProperty(templateHtml, "taskName", task.name) + html;
    }
    tasksContainer.innerHTML = html;
    taskInput.value = "";
  }

  function createStep(key) {
    console.log(key);
    if (key.code === "Enter") {
      let taskName = createStepInput.parentNode.parentNode.previousElementSibling.innerText;
      console.log(taskName);
      
      for (let task of tasks.get(currentPage)) {
        if (task.name === taskName) {
          console.log(taskName);
          task.steps.push(createStepInput.value);
          getSnippet("step-snippet", addStepToPage, task.steps);
        }
      }
    }
  }

  function addStepToPage(templateHtml, parameter) {
    let html = "";
    console.log(parameter);
    for (let step of parameter) {
      html = insertProperty(templateHtml, "step", step) + html;
    }
    stepsContainer.innerHTML = html;
    createStepInput.value = "";
  }

  function loadTaskPanel(templateHtml) {
    // console.log(parameter);
    // let html = "";
    // html = insertProperty(templateHtml, "taskName", parameter)
    // taskPanel.innerHTML = html;
  }

  function openTaskPanel(event) {
    getSnippet("task-panel", loadTaskPanel, event.target.innerText);
    document.getElementById("task-name").innerText = event.target.innerText;
    taskDetailsPanel.style.width = "25%";
    event.stopPropagation();
  }

  function showMyDay() {
    currentPage = "myDay";
    getSnippet("middle-column-snippet", loadMyDay);
    getSnippet("task-snippet", addTaskToPage);
  }

  function loadMyDay(templateHtml) {
    html = insertProperty(templateHtml, "title", "My Day");
    middleColumn.innerHTML = html;
  }

  function showImportant() {
    currentPage = "important";
    getSnippet("middle-column-snippet", loadImportant);
    getSnippet("task-snippet", addTaskToPage);
  }

  function loadImportant(templateHtml) {
    html = insertProperty(templateHtml, "title", "Important");
    middleColumn.innerHTML = html;
  }

  init();
})();
