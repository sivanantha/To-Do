"use strict";

(function () {
  const tasks = new Map();
  const createListInput = ".newlist-container input";
  const createListContainer = ".newlist-container";
  const sidebar = ".left-column";
  const sidebarOpenButton = "#sidebar-open-btn";
  const sidebarCloseButton = "#sidebar-close-btn";
  const taskPanelCloseButton = "#task-panel-close-btn";
  const createtaskInput = ".task-list-container .add-task input";
  const myDay = "#my-day";
  const important = "#important";
  const createStepInput = ".add-steps input";
  const taskPanel = ".right-column";
  const stepsContainer = ".steps-container";
  const middleColumn = ".middle-column";
  const tasksContainer = ".tasks";
  const listContainer = ".lists";
  const taskCheckbox = ".tickbox-container";
  let currentPage = "myDay";

  function init() {
    tasks.set("myDay", []);
    tasks.set("important", []);
    loadMyDay();
  }

  function bindEventListeners() {
    addListener(sidebarOpenButton, "click", openSideBar);
    addListener(sidebarCloseButton, "click", closeSideBar);
    addListener(taskPanelCloseButton, "click", closeTaskPanel);
    addListener(createListInput, "keyup", createList);
    addListener(createtaskInput, "keyup", createTask);
    addListener(myDay, "click", loadMyDay);
    addListener(important, "click", loadImportant);
    addListener(tasksContainer, "click", openTaskPanel);
    addListener(createStepInput, "keyup", createStep);
    addListener(listContainer, "click", loadList);
  }

  function addListener(element, event, listener) {
    document.querySelector(element).addEventListener(event, listener);
  }

  function getSnippet(snippetName, handler, parameter) {
    let request = new XMLHttpRequest();
    request.open("GET", `snippets/${snippetName}.html`, true);
    request.responseType = "text";
    request.onload = () => {
      handler(request.responseText, parameter);
      bindEventListeners();
    };
    request.send();
  }

  function insertHtml(parent, html) {
    document.querySelector(parent).innerHTML = html;
  }

  function insertProperty(html, propertyName, propertyValue) {
    var propertyToReplace = "{{" + propertyName + "}}";
    html = html.replace(new RegExp(propertyToReplace, "g"), propertyValue);
    return html;
  }

  function openSideBar() {
    let node = document.querySelector(sidebar);
    node.style.width = "21vw";
    node.style.visibility = "visible";
    document.querySelector(sidebarOpenButton).style.display = "none";
  }

  function closeSideBar() {
    let node = document.querySelector(sidebar);
    node.style.width = "0px";
    node.style.visibility = "hidden";
    document.querySelector(sidebarOpenButton).style.display = "inline-block";
  }

  function closeTaskPanel() {
    let panel = document.querySelector(taskPanel);
    panel.style.width = "0px";
    panel.style.visibility = "hidden";
  }

  function getTodayDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function createList(key) {
    if (key.keyCode === 13) {
      let listName = document.querySelector(createListInput).value;
      tasks.set(listName, []);
      addListToPage(listName);
      currentPage = listName;
      getSnippet("middle-column-snippet", showList);
    }
  }

  function addListToPage(listName) {
    let inputContainer = document.querySelector(createListContainer);
    let div = document.createElement("div");
    let icon = document.createElement("i");
    let link = document.createElement("a");
    let span = document.createElement("span");
    span.classList.add("task-count");
    div.setAttribute("dir", "ltr");
    icon.classList.add("icon", "ms-Icon", "ms-Icon--BulletedList2");
    div.appendChild(icon);
    link.appendChild(document.createTextNode(listName));
    div.appendChild(link);
    div.appendChild(span);
    inputContainer.parentNode.insertBefore(div, inputContainer);
    document.querySelector(createListInput).value = "";
  }

  function createTask(key) {
    if (key.keyCode === 13) {
      let taskName = document.querySelector(createtaskInput);
      tasks.get(currentPage).push({ name: taskName.value, steps: [] });
      getSnippet("task-snippet", addTasksToPage);
      taskName.value = "";
    }
  }

  function addTasksToPage(templateHtml) {
    let html = "";
    let temp;
    for (let task of tasks.get(currentPage)) {
      temp = insertProperty(templateHtml, "taskName", task.name);
      html = insertProperty(temp, "stepCount", task.steps.length) + html;
    }
    insertHtml(tasksContainer, html);
    let checkboxes = document.querySelectorAll(".tickbox-container");
    console.log(checkboxes);
    for (let node of checkboxes) {
      console.log(checkboxes[0]);
      node.addEventListener("click", makeTaskCompleted);
    }
  }

  function getTaskSteps(taskName) {
    let steps;
    for (let task of tasks.get(currentPage)) {
      if (task.name === taskName) {
        steps = task.steps;
      }
    }
    return steps;
  }

  function createStep(key) {
    if (key.code === "Enter") {
      let stepInput = document.querySelector(createStepInput);
      let taskName = document.querySelector("#task-name").innerText;
      let steps = getTaskSteps(taskName);
      steps.push(stepInput.value);
      getSnippet("step-snippet", addStepsToPage, steps);
      stepInput.value = "";
    }
  }

  function addStepsToPage(templateHtml, steps) {
    let html = "";
    for (let step of steps) {
      html += insertProperty(templateHtml, "step", step);
    }
    insertHtml(stepsContainer, html);
    getSnippet("task-snippet", addTasksToPage);
  }

  function openTaskPanel(event) {
    let targetElement = event.target;
    if (targetElement.matches("span")) {
      let taskName = event.target.innerText;
      let panel = document.querySelector(taskPanel);
      console.log(getTaskSteps(taskName));
      getSnippet("step-snippet", addStepsToPage, getTaskSteps(taskName));
      document.getElementById("task-name").innerText = taskName;
      panel.style.width = "25%";
      panel.style.visibility = "visible";
    }
  }

  function loadMyDay() {
    currentPage = "myDay";
    getSnippet("middle-column-snippet", showMyDay);
    getSnippet("task-snippet", addTasksToPage);
  }

  function showMyDay(templateHtml) {
    let html = insertProperty(templateHtml, "title", "My Day");
    insertHtml(".middle-column", html);
    document.querySelector(".date-container").innerText = getTodayDate();
  }

  function loadImportant() {
    currentPage = "important";
    getSnippet("middle-column-snippet", showImportant);
    getSnippet("task-snippet", addTasksToPage);
  }

  function showImportant(templateHtml) {
    let html = insertProperty(templateHtml, "title", "Important");
    insertHtml(middleColumn, html);
    applyBlueColor(".toolbar-title");
  }

  function loadList(event) {
    if (event.target.matches("a")) {
      currentPage = event.target.innerText;
      getSnippet("middle-column-snippet", showList);
      getSnippet("task-snippet", addTasksToPage);
      event.stopPropagation();
    }
  }

  function showList(templateHtml) {
    let html = insertProperty(templateHtml, "title", currentPage);
    insertHtml(middleColumn, html);
    applyBlueColor(".toolbar-title");
  }

  function applyBlueColor(element) {
    document.querySelector(element).classList.add("color-blue");
  }

  function makeTaskCompleted(event) {
    let targetElement = event.target;
    if (targetElement.matches("i")) {
      targetElement.parentNode.children[0].classList.toggle(
        "reveal-checkedbox"
      );
      targetElement.parentNode.nextElementSibling.classList.toggle(
        "strike-through"
      );
    }
  }

  init();
})();
