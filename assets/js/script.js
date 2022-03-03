var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.textContent = "This is a new task.";
    listItemEl.className= "task-item";
    taskToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);