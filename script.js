// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".task_manager");
const confirmDeleteEl = document.querySelector(".confirm_delete");
const confirmDeleteBtn = confirmDeleteEl.querySelector(".confirmed_delete");
const cancelDeleteBtn = confirmDeleteEl.querySelector(".cancel_delete");
let indexToBeDeleted = null


// Function to return formatted date
function formatDate() {
  var myDate = new Date();
  const year = myDate.getFullYear();
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  const hours = myDate.getHours();
  const minutes = myDate.getMinutes();
  const seconds = myDate.getSeconds();
  if(parseInt(month) < 10) {
    month = '0' + month;
  }
  if(parseInt(day) < 10) {
    day = '0' + day;
  }
  const formattedDate = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  return formattedDate;
}

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// function to delete the selected task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function autoResize(taskText) {
   taskText.style.height = 'auto';
   taskText.style.height = taskText.scrollHeight + 'px';
}

// Function to render tasks
function renderTasks() {
  const taskContainer = document.getElementById('task_container');
  taskContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task_card');
    let classVal = "pending";
    let textVal = "Pending"
    if (task.completed) {
      classVal = "completed";
      textVal = "Completed";
    }

    console.log(task);
    taskCard.classList.add(classVal);

    const taskText = document.createElement('textarea');
    taskText.value = task.text;
    console.log(taskText.value);
    taskText.disabled = true;
    

    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = textVal;

    const taskCreation = document.createElement('p');
    taskCreation.classList.add('creation');
    taskCreation.innerText = `Created at: ${task.createdAt}`;

    const taskUpdate = document.createElement('p');
    taskUpdate.classList.add('update');
    taskUpdate.innerText = `Last updated at: ${task.updatedAt}`;

    const toggleButton = document.createElement('button');
    toggleButton.classList.add("button-box");
    const btnContentEl = document.createElement("span");
    btnContentEl.classList.add("green");
    btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
    toggleButton.appendChild(btnContentEl);
    toggleButton.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    const editButton = document.createElement('button');
    editButton.classList.add("button-box");
    const editBtnContentEl = document.createElement("span");
    editBtnContentEl.classList.add("blue");
    editBtnContentEl.innerText = 'Edit';
    editButton.appendChild(editBtnContentEl);
    editButton.addEventListener('click', () => {
      taskText.disabled = false;
      taskText.focus();
      
      taskText.addEventListener('keydown', (e) => {
        autoResize(taskText);
        if(e.code === "Enter"){
          task.text = e.target.value;
          task.updatedAt = `${formatDate()}`;
          saveTasks();
          renderTasks();
        }
      });
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("button-box");
    const delBtnContentEl = document.createElement("span");
    delBtnContentEl.classList.add("red");
    delBtnContentEl.innerText = 'Delete';
    deleteButton.appendChild(delBtnContentEl);
    deleteButton.addEventListener('click', () => {
      indexToBeDeleted = index
      confirmDeleteEl.style.display = "block";
      taskManagerContainer.classList.add("overlay");
    });

    taskCard.appendChild(taskText);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(taskCreation);
    taskCard.appendChild(taskUpdate);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(editButton);
    taskCard.appendChild(deleteButton);
    taskText.style.height = 'auto';

    taskContainer.appendChild(taskCard);
    taskText.style.height = 'auto';
    taskText.style.height = taskText.scrollHeight + 'px';
    
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const taskInput = document.getElementById('task_input');
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    const newTask = {
      text: taskText,
      completed: false,
      createdAt: new Date().toDateString(),
      updatedAt: `${formatDate()}`,
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks();
  }
}

document.addEventListener("DOMContentLoaded", () => {

  // Initial rendering of tasks
  renderTasks();

  // Add event listener to the form submit event
  document.getElementById('task_form').addEventListener('submit', handleFormSubmit);

  confirmDeleteBtn.addEventListener("click", () => {
    confirmDeleteEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
    deleteTask(indexToBeDeleted);
  });
  
  cancelDeleteBtn.addEventListener("click", () => {
    confirmDeleteEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
  });
});