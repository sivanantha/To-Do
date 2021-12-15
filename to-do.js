"use strict";

(function () {
  const categories = [
    { name: "My Day", icon: "ms-Icon--Sunny", tasks: [] },
    { name: "Important", icon: "ms-Icon--FavoriteStar", tasks: [] },
    { name: "Planned", icon: "ms-Icon--Calendar", tasks: [] },
    { name: "Assigned to me", icon: "ms-Icon--Contact", tasks: [] },
    { name: "Tasks", icon: "ms-Icon--Home", tasks: [] },
  ];
  const createListContainer = ".newlist-container";
  const myDay = "#my-day";
  const important = "#important";
  const listContainer = ".lists";
  const taskCheckbox = ".tickbox-container";
  let currentPage = "My Day";
  let currentTask = "";

  function init() {
    getSnippet("category-snippet", renderDefaultCategories);
    getSnippet("middle-column-snippet", renderMiddlePage);
    bindEventListener("#sidebar-close-btn", "click", toggleSideBar);
    bindEventListener(".newlist-container input", "keyup", createCategory);
    bindEventListener("#task-panel-close-btn", "click", toggleTaskPanel);
    bindEventListener(".add-steps input", "keyup", createStep);
  }

  function bindEventListener(element, event, listener) {
    if (element instanceof window.Element) {
      element.addEventListener(event, listener);
    } else {
      document.querySelector(element).addEventListener(event, listener);
    }
  }

  function bindEventListenerToAll(elements, event, listener) {
    for (let element of elements) {
      element.addEventListener(event, listener);
    }
  }

  function getSnippet(snippetName, handler) {
    let request = new XMLHttpRequest();
    request.open("GET", `snippets/${snippetName}.html`, true);
    request.responseType = "text";
    request.onload = () => {
      handler(request.responseText);
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

  function toggleSideBar() {
    let node = document.querySelector(".left-column");
    node.classList.toggle("open-sidebar");
    document
      .querySelector("#sidebar-open-btn")
      .classList.toggle("hide-element");
  }

  function getTodayDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  function renderDefaultCategories(templateHtml) {
    renderCategories(templateHtml, categories, ".default-categories");
    bindEventListenerToAll(document.querySelectorAll(".default-categories a"), "click", changeCategory);
  }

  function renderCategories(
    templateHtml,
    categoryList = categories.slice(5,),
    targetElement = ".category-container"
  ) {
    let html = "";
    let temp;
    for (let category of categoryList) {
      temp = insertProperty(templateHtml, "category", category.name);
      html += insertProperty(temp, "icon", category.icon);
    }
    insertHtml(targetElement, html);
    bindEventListenerToAll(document.querySelectorAll(".category-container a"), "click", changeCategory);
  }

  function createCategory(event) {
    let categoryName = event.target.value;
    if (event.keyCode === 13 && categoryName != "") {
      categories.push({
        name: categoryName,
        icon: "ms-Icon--BulletedList2",
        tasks: [],
      });
      currentPage = categoryName;
      getSnippet("category-snippet", renderCategories);
      getSnippet("middle-column-snippet", renderTasks);
      changeCategory(event);
      event.target.value = "";
    }
  }

  function createTask(event) {
    if (event.keyCode === 13 && event.target.value != "") {
      let taskInput = document.querySelector(
        ".task-list-container .add-task input"
      );
      getTasks(currentPage).push({ name: taskInput.value, steps: [] });
      getSnippet("task-snippet", renderTasks);
      taskInput.value = "";
    }
  }

  function getTasks(categoryName) {
    for (let category of categories) {
      if (category.name === categoryName) {
        return category.tasks;
      }
    }
    return [];
  }

  function renderTasks(templateHtml) {
    let html = "";
    let temp;
    for (let task of getTasks(currentPage)) {
      temp = insertProperty(templateHtml, "taskName", task.name);
      html = insertProperty(temp, "stepCount", task.steps.length) + html;
    }
    insertHtml(".tasks", html);
    let checkboxes = document.querySelectorAll(".tasks .tickbox-container");
    console.log(document.querySelectorAll(".task-name"));
    bindEventListenerToAll(
      document.querySelectorAll("span.task-name"),
      "click",
      toggleTaskPanel
    );
    bindEventListenerToAll(checkboxes, "click", markAsCompleted);
  }

  function getSteps(taskName) {
    for (let task of getTasks(currentPage)) {
      if (task.name === taskName) {
        return task.steps;
      }
    }
    return [];
  }

  function createStep(key) {
    if (key.code === "Enter") {
      let stepInput = document.querySelector(".add-steps input");
      let steps = getSteps(currentTask);
      steps.push(stepInput.value);
      getSnippet("step-snippet", renderSteps);
      stepInput.value = "";
    }
  }

  function renderSteps(templateHtml) {
    let html = "";
    for (let step of getSteps(currentTask)) {
      html += insertProperty(templateHtml, "step", step);
    }
    insertHtml(".steps-container", html);
    bindEventListenerToAll(
      document.querySelectorAll(".task-details button.tickbox-container"),
      "click",
      markAsCompleted
    );
    getSnippet("task-snippet", renderTasks);
  }

  function toggleTaskPanel(event) {
    let taskName = event.target.innerText;
    currentTask = taskName;
    let panel = document.querySelector(".right-column");
    getSnippet("step-snippet", renderSteps);
    document.getElementById("task-name").innerText = taskName;
    panel.classList.toggle("open-task-panel");
  }

  function renderMiddlePage(templateHtml) {
    let html = insertProperty(templateHtml, "title", "My Day");
    insertHtml(".middle-column", html);
    document.querySelector(".date-container").innerText = getTodayDate();
    bindEventListener("#sidebar-open-btn", "click", toggleSideBar);
    bindEventListener(
      ".task-list-container .add-task input",
      "keyup",
      createTask
    );
  }

  function changeCategory(event) {
    currentPage = event.target.innerText;
    let pageTitle = document.querySelector(".toolbar span.toolbar-title");
    pageTitle.innerText = currentPage;
    getSnippet("task-snippet", renderTasks);
    if (currentPage === "My Day") {
      document.querySelector(".toolbar span.date-container").classList.remove("hide-element");
      pageTitle.classList.remove("color-blue");
    } else {
      document.querySelector(".toolbar span.date-container").classList.add("hide-element");
      pageTitle.classList.add("color-blue");
    }
  }

  function markAsCompleted(event) {
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
