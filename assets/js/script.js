var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var tasks = [];

// listens for form submission and routes info to other functions
var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    var isEdit = formEl.hasAttribute("data-task-id");

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!")
        return false;
    }

    // clears out form fields
    formEl.reset();

    //send it as an arguement
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeTaskEdit(taskNameInput, taskTypeInput, taskId);
    }
    // no data attibute, so create object as normal
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    };
};

// create the basic content for new elements
var createTaskEl = function (taskDataObj) {
    //create list item 
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    //create div to hold task info anmd add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);
    saveTasks();

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to to list
    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
};

// updates info when editing a task
var completeTaskEdit = function (taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    saveTasks();

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    alert("Task Updated");
}

// adds interactive elements to dynamic content
var createTaskActions = function (taskId) {
    var actionContaierEl = document.createElement("div");
    actionContaierEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContaierEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContaierEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContaierEl.appendChild(statusSelectEl);

    return actionContaierEl;
};

// listens for which dynamic buttons are pressed
var taskButtonHandler = function (event) {
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

// edits a task
var editTask = function (taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    // set form to task values
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

// deletes a task
var deleteTask = function (taskId) {
    var isEdit = formEl.hasAttribute("data-task-id") && formEl.getAttribute("data-task-id") == taskId;
    if (isEdit) {
        alert("Task is open in editor! Please save it first!")
        return false;
    };
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new temp array
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        };
    };

    // reassign tasks array to be the same as the temp array
    tasks = updatedTaskArr;
    saveTasks();
};

var taskStatusChangeHandler = function (event) {
    // get the task's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    };

    // update task's in array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        };
    };
    saveTasks();
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
    savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the 'createTaskEl()' funciton
        createTaskEl(savedTasks[i]);

        // assign the element to the correct category
        var taskSelected = document.querySelector(".task-item[data-task-id='" + savedTasks[i].id + "']");
        var statusValue = savedTasks[i].status;
        
        // also changes the dropdown to the correct setting to make it easier to move tasks to 'To Do'
        if (statusValue === "to do") {
            tasksToDoEl.appendChild(taskSelected);
            taskSelected.querySelector("option[value='To Do']").selected = "selected";
        }
        else if (statusValue === "in progress") {
            tasksInProgressEl.appendChild(taskSelected);
            taskSelected.querySelector("option[value='In Progress']").selected = "selected";
        }
        else if (statusValue === "completed") {
            tasksCompletedEl.appendChild(taskSelected);
            taskSelected.querySelector("option[value='Completed']").selected = "selected";
        };
    };

    // puts the counter ahead of where the other id are at
    taskIdCounter = savedTasks[savedTasks[i - 1].length] + 1;
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();