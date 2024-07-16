// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filteredTasks = [...tasks];

const $taskManagerContainer = $(".task_manager");
const $confirmDeleteEl = $(".confirm_delete");
const $confirmDeleteBtn = $confirmDeleteEl.find(".confirmed_delete");
const $cancelDeleteBtn = $confirmDeleteEl.find(".cancel_delete");
const $searchInput = $("#search_input");
const $editModal = $("#edit_modal");
const $editModalClose = $("#edit_modal_close");
const $editModalSave = $("#edit_modal_save");
const $editModalTextarea = $("#edit_modal_textarea");
let indexToBeDeleted = null;
let currentEditIndex = null;

/**
 * Returns the current date and time formatted as 'YYYY/MM/DD HH:MM:SS'.
 * @returns {string} The formatted date and time.
 */
const formatDate = () => {
  let myDate = new Date();
  const year = myDate.getFullYear();
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let hours = myDate.getHours();
  let minutes = myDate.getMinutes();
  let seconds = myDate.getSeconds();

  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }
  if (parseInt(hours) < 10) {
    hours = "0" + hours;
  }
  if (parseInt(minutes) < 10) {
    minutes = "0" + minutes;
  }
  if (parseInt(seconds) < 10) {
    seconds = "0" + seconds;
  }

  const formattedDate =
    year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds;
  return formattedDate;
};

/**
 * Saves the tasks array to local storage.
 */
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

/**
 * Deletes the task at the specified index.
 * @param {number} index - The index of the task to delete.
 */
const deleteTask = (index) => {
  tasks.splice(index, 1);
  saveTasks();
  filterTasks();
};

/**
 * Automatically resizes the textarea to fit its content.
 * @param {HTMLTextAreaElement} taskText - The textarea element to resize.
 */
const autoResize = (taskText) => {
  $(taskText)
    .css("height", "auto")
    .css("height", taskText.scrollHeight + "px");
};

/**
 * Renders the tasks in the task container.
 */
const renderTasks = () => {
  const $taskContainer = $("#task_container").empty();

  filteredTasks.forEach((task, index) => {
    const classVal = task.completed ? "completed" : "pending";
    const textVal = task.completed ? "Completed" : "Pending";

    const $taskCard = $("<div>")
      .addClass("task_card " + classVal)
      .append($("<p>").addClass("status").text(textVal))
      .append($("<div>").addClass("status").text(`Assigned To: ${task.assignedTo}`))
      .append($("<div>").addClass("task_text").text(task.text))
      .append($("<p>").addClass("update").text(`Last updated at: ${task.updatedAt}`))
      .append(createToggleButton(task, index))
      .append(createEditButton(task, index))
      .append(createDeleteButton(index))
      .append($("<p>").addClass("creation").text(`Created at: ${task.createdAt}`));

    $taskContainer.append($taskCard);
  });
};

/**
 * Opens the modal to edit the task at the specified index.
 * @param {number} index - The index of the task to edit.
 */
const openEditModal = (index) => {
  currentEditIndex = index;
  const task = tasks[index];
  $editModalTextarea.val(task.text);
  autoResize($editModalTextarea[0]);
  $editModal.show();
};

/**
 * Creates a toggle button to mark tasks as completed or pending.
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @returns {jQuery} The jQuery object for the toggle button.
 */
const createToggleButton = (task, index) => {
  return $("<button>")
    .addClass("button-box")
    .append(
      $("<span>")
        .addClass("green")
        .text(task.completed ? "Mark as Pending" : "Mark as Completed")
    )
    .on("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      filterTasks();
    });
};

/**
 * Creates an edit button to enable editing of the task text.
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @returns {jQuery} The jQuery object for the edit button.
 */
const createEditButton = (task, index) => {
  return $("<button>")
    .addClass("button-box")
    .append($("<span>").addClass("blue").text("Edit"))
    .on("click", () => openEditModal(index));
};

/**
 * Creates a delete button to delete the task.
 * @param {number} index - The index of the task.
 * @returns {jQuery} The jQuery object for the delete button.
 */
const createDeleteButton = (index) => {
  return $("<button>")
    .addClass("button-box")
    .append($("<span>").addClass("red").text("Delete"))
    .on("click", () => {
      indexToBeDeleted = index;
      $confirmDeleteEl.show();
      $taskManagerContainer.addClass("overlay");
      window.scrollTo(0, 0);
      $(".toolbar").css("display", "none");
    });
};

/**
 * Handles the form submission to add a new task.
 * @param {Event} event - The form submission event.
 */
const handleFormSubmit = (event) => {
  event.preventDefault();
  const taskText = $("#task_input").val().trim();
  const user = $("#user_input").val().trim();

  if (taskText) {
    tasks.push({
      text: taskText,
      completed: false,
      assignedTo: user,
      createdAt: new Date().toDateString(),
      updatedAt: formatDate(),
    });
    saveTasks();
    $("#task_input").val("");
    filterTasks();
  }
};

/**
 * Filters tasks based on the search input.
 */
const filterTasks = () => {
  const searchTerm = $searchInput.val().toLowerCase();
  filteredTasks = tasks.filter((task) => {
    return (
      task.text.toLowerCase().includes(searchTerm) ||
      task.assignedTo.toLowerCase().includes(searchTerm)
    );
  });
  renderTasks();
};

$(document).ready(() => {
  renderTasks();

  $("#task_form").on("submit", handleFormSubmit);
  $searchInput.on("input", filterTasks);

  $("#task_input").on("input", function () {
    autoResize(this);
  });

  $confirmDeleteBtn.on("click", () => {
    $confirmDeleteEl.hide();
    $taskManagerContainer.removeClass("overlay");
    deleteTask(indexToBeDeleted);
    $(".toolbar").css("display", "block");
  });

  $cancelDeleteBtn.on("click", () => {
    $confirmDeleteEl.hide();
    $taskManagerContainer.removeClass("overlay");
    $(".toolbar").css("display", "block");
  });

  $editModalClose.on("click", () => {
    $editModal.hide();
  });

  $editModalSave.on("click", () => {
    if (currentEditIndex !== null) {
      tasks[currentEditIndex].text = $editModalTextarea.val();
      tasks[currentEditIndex].updatedAt = formatDate();
      saveTasks();
      filterTasks();
      $editModal.hide();
    }
  });
});
