"use strict";

$(document).ready(function () {
  const categories = [
    { name: "My Day", icon: "ms-Icon--Sunny", tasks: [] },
    { name: "Important", icon: "ms-Icon--FavoriteStar", tasks: [] },
    { name: "Planned", icon: "ms-Icon--Calendar", tasks: [] },
    { name: "Assigned to me", icon: "ms-Icon--Contact", tasks: [] },
    { name: "Tasks", icon: "ms-Icon--Home", tasks: [] },
  ];
  let currentPage = "My Day";
  let currentTask = "";

  /**
   * Triggers the startup functions and intializes the program.
   */
  function init() {
    getSnippet("category-snippet", renderDefaultCategories);
    getSnippet("middle-column-snippet", renderMiddlePage);
    bindEventListener("#sidebar-close-btn", "click", toggleSideBar);
    bindEventListener(".newlist-container input", "keyup", createCategory);
    bindEventListener("#task-panel-close-btn", "click", toggleTaskPanel);
    bindEventListener(".add-steps input", "keyup", createStep);
  }

  /**
   * Adds event listener to all the selected element.
   *
   * @param element the target element selector to add event listener.
   * @param event the name of the event.
   * @param listener the function to be called if event is triggered.
   */
  function bindEventListener(element, event, listener) {
    $(element).on(event, listener);
  }

  /**
   * Fetches the specified snippet from the server. When the response
   * is received invokes the callback function and passes the response
   * as the parameter.
   *
   * @param snippetName the snippet to be fetched.
   * @param handler the callback function to invoked when response
   *        is received.
   */
  function getSnippet(snippetName, handler) {
    $.ajax({
      type: "GET",
      url: `snippets/${snippetName}.html`,
      dataType: "text",
      success: handler,
      async: true,
    });
  }

  /**
   * Inserts the specified html into the target element.
   *
   * @param targetElement the element in which the html to be inserted.
   * @param html the html to be inserted.
   */
  function insertHtml(targetElement, html) {
    $(targetElement).html(html);
  }

  /**
   * Inserts the specified property in the given html.
   *
   * @param html the html in which property to be inserted.
   * @param propertyName the name of the property.
   * @param propertyValue the value of the property to insert.
   * @returns the html with inserted property value.
   */
  function insertProperty(html, propertyName, propertyValue) {
    let propertyToReplace = "{{" + propertyName + "}}";
    html = html.replace(new RegExp(propertyToReplace, "g"), propertyValue);
    return html;
  }

  /**
   * Toggles (open/close) the left sidebar.
   */
  function toggleSideBar() {
    $(".left-column").toggleClass("open-sidebar");
    $("#sidebar-open-btn").toggleClass("hide-element");
  }

  /**
   * Gets the today date in the following format.
   * (e.g) Thursday, December 16
   *
   * @returns the today date.
   */
  function getTodayDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Renders the default categories.
   * (My Day, Important, Planned, Assigned To Me, Tasks)
   *
   * @param templateHtml the categories template html to render
   *        categories.
   * @param status the status object containing request status.
   * @param xhr the xmlHttpRequest object.
   */
  function renderDefaultCategories(templateHtml, status, xhr) {
    renderCategories(
      templateHtml,
      status,
      xhr,
      categories,
      ".default-categories"
    );
    bindEventListener(".default-categories a", "click", changeCategory);
  }

  /**
   * Renders the categories from the specified categories array.
   *
   * @param templateHtml the categories template html to render
   *        categories.
   * @param status the status object containing request status.
   * @param xhr the xmlHttpRequest object.
   * @param categoryList the array containing categories.
   * @param targetElement the elemment in which the html to be inserted.
   */
  function renderCategories(
    templateHtml,
    status,
    xhr,
    categoryList = categories.slice(5),
    targetElement = ".category-container"
  ) {
    let html = "";
    let temp;
    for (let category of categoryList) {
      temp = insertProperty(templateHtml, "category", category.name);
      html += insertProperty(temp, "icon", category.icon);
    }
    insertHtml(targetElement, html);
    bindEventListener(".category-container a", "click", changeCategory);
  }

  /**
   * Handles the create category input event.
   * Creates a new category and stores in the category array.
   * Invokes the renderCategories and renderTasks functions.
   *
   * @param event the event object passed by the event handler.
   */
  function createCategory(event) {
    let categoryName = $(event.target).val();
    if (event.keyCode === 13 && categoryName) {
      categories.push({
        name: categoryName,
        icon: "ms-Icon--BulletedList2",
        tasks: [],
      });
      currentPage = categoryName;
      getSnippet("category-snippet", renderCategories);
      getSnippet("middle-column-snippet", renderTasks);
      changePageTitle();
      $(event.target).val("");
    }
  }

  /**
   * Handles the create task input event.
   * Creates a new task and stores in the current category.
   * Invokes the renderTasks function.
   *
   * @param event the event object passed by the event handler.
   */
  function createTask(event) {
    let taskInput = $(event.target).val();
    if (event.keyCode === 13 && taskInput) {
      getTasks(currentPage).push({ name: taskInput, steps: [] });
      getSnippet("task-snippet", renderTasks);
      event.target.value = "";
    }
  }

  /**
   * Fetches the specified category's tasks.
   *
   * @param categoryName the category name whose tasks to be fetched.
   * @returns the array containing tasks if category is found, otherwise an
   *          empty array.
   */
  function getTasks(categoryName) {
    for (let category of categories) {
      if (category.name === categoryName) {
        return category.tasks;
      }
    }
    return [];
  }

  /**
   * Renders the tasks of the current category.
   *
   * @param templateHtml the task template html to render
   *        tasks.
   * @param status the status object containing request status.
   * @param xhr the xmlHttpRequest object.
   */
  function renderTasks(templateHtml, status, xhr) {
    let html = "";
    let temp;
    for (let task of getTasks(currentPage)) {
      temp = insertProperty(templateHtml, "taskName", task.name);
      html = insertProperty(temp, "stepCount", task.steps.length) + html;
    }
    insertHtml(".tasks", html);
    bindEventListener("span.task-name", "click", toggleTaskPanel);
    bindEventListener(
      ".tasks .tickbox-container",
      "click",
      toggleCheckboxAndStrikeThrough
    );
  }

  /**
   * Fetches the current categoriy's specified task's steps.
   *
   * @param taskName the task name whose steps to be fetched.
   * @returns the array containing steps if task is found, otherwise an
   *          empty array.
   */
  function getSteps(taskName) {
    for (let task of getTasks(currentPage)) {
      if (task.name === taskName) {
        return task.steps;
      }
    }
    return [];
  }

  /**
   * Handles the create step input event.
   * Creates a new step and stores in the current task.
   * Invokes the renderSteps function.
   *
   * @param event the event object passed by the event handler.
   */
  function createStep(event) {
    let stepInput = $(event.target).val();
    if (event.code === "Enter" && stepInput) {
      let steps = getSteps(currentTask);
      steps.push(stepInput);
      getSnippet("step-snippet", renderSteps);
      $(event.target).val("");
    }
  }

  /**
   * Renders the steps of the current task.
   * Invokes the rederTasks function.
   *
   * @param templateHtml the step template html to render
   *        steps.
   * @param status the status object containing request status.
   * @param xhr the xmlHttpRequest object.
   */
  function renderSteps(templateHtml, status, xhr) {
    let html = "";
    for (let step of getSteps(currentTask)) {
      html += insertProperty(templateHtml, "step", step);
    }
    insertHtml(".steps-container", html);
    bindEventListener(
      ".task-details button.tickbox-container",
      "click",
      toggleCheckboxAndStrikeThrough
    );
    getSnippet("task-snippet", renderTasks);
  }

  /**
   * Toggles (open/close) the right task details panel.
   * Invokes the renderSteps function.
   *
   * @param event the event object passed by the event handler.
   */
  function toggleTaskPanel(event) {
    let taskName = $(event.target).text();
    currentTask = taskName;
    getSnippet("step-snippet", renderSteps);
    $("#task-name").text(taskName);
    $(".right-column").toggleClass("open-task-panel");
  }

  /**
   * Renders the middle page.
   *
   * @param templateHtml the middle page template html to render
   *        middle page.
   * @param status the status object containing request status.
   * @param xhr the xmlHttpRequest object.
   */
  function renderMiddlePage(templateHtml, status, xhr) {
    let html = insertProperty(templateHtml, "title", "My Day");
    insertHtml(".middle-column", html);
    $(".date-container").text(getTodayDate());
    bindEventListener("#sidebar-open-btn", "click", toggleSideBar);
    bindEventListener(
      ".task-list-container .add-task input",
      "keyup",
      createTask
    );
  }

  /**
   * Handles the categories on click event.
   * Changes the current category. Invokes the renderTasks to load
   * selected categoriy's tasks.
   *
   * @param event the event object passed by the event handler.
   */
  function changeCategory(event) {
    currentPage = $(event.target).text();
    getSnippet("task-snippet", renderTasks);
    changePageTitle();
  }

  /**
   * Changes the page title to the selected category name.
   * If selected category is My Day then displays date.
   * Category names are displayed in blue color except My Day.
   */
  function changePageTitle() {
    let pageTitle = $(".toolbar span.toolbar-title");
    pageTitle.text(currentPage);
    if (currentPage === "My Day") {
      $(".toolbar span.date-container").removeClass("hide-element");
      pageTitle.removeClass("color-blue");
    } else {
      $(".toolbar span.date-container").addClass("hide-element");
      pageTitle.addClass("color-blue");
    }
  }

  /**
   * Handles the task and step checkbox on click events.
   * Toggles the checkbox and strike througth the text of the task
   * or step element which triggered the event.
   *
   * @param event the event object passed by the event handler.
   */
  function toggleCheckboxAndStrikeThrough(event) {
    let targetElement = event.target;
    $(targetElement)
      .parent()
      .children("i:first")
      .toggleClass("reveal-checkedbox");
    $(targetElement).parent().next().toggleClass("strike-through");
  }

  init();
});
