var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

buttonEl.addEventListener("click", function() {
    var taskItemEl = document.createElement("li");
    taskItemEl.textContent = "hello";
    taskItemEl.className = "task-item";
    tasksToDoEl.appendChild(taskItemEl);
});