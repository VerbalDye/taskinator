var buttonEl = document.querySelector("#save-task");
var taskToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.textContent = "This is a new task.";
    listItemEl.className= "task-item";
    taskToDoEl.appendChild(listItemEl);
};

buttonEl.addEventListener("click", createTaskHandler);
