let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        addedAt: new Date().toLocaleString(),
        completedAt: ""
    };

    tasks.push(task);
    saveTasks();

    taskInput.value = "";
    displayTasks();
}

function displayTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingCount.textContent = pendingTasks.length;
    completedCount.textContent = completedTasks.length;

    if (pendingTasks.length === 0) {
        pendingList.innerHTML = `
            <div class="empty">
                No pending tasks. You're all caught up!
            </div>
        `;
    }

    if (completedTasks.length === 0) {
        completedList.innerHTML = `
            <div class="empty">
                No completed tasks yet.
            </div>
        `;
    }

    pendingTasks.forEach(task => {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(task => {
        completedList.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const infoDiv = document.createElement("div");
    infoDiv.className = "task-info";

    const textDiv = document.createElement("div");
    textDiv.className = "task-text";
    textDiv.textContent = task.text;

    const timeDiv = document.createElement("div");
    timeDiv.className = "timestamp";

    if (task.completed) {
        timeDiv.textContent =
            "Added: " + task.addedAt +
            " | Completed: " + task.completedAt;
    } else {
        timeDiv.textContent = "Added: " + task.addedAt;
    }

    infoDiv.appendChild(textDiv);
    infoDiv.appendChild(timeDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    if (!task.completed) {
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = "Mark Complete";

        completeBtn.onclick = function () {
            completeTask(task.id);
        };

        actionsDiv.appendChild(completeBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    editBtn.onclick = function () {
        editTask(task.id, infoDiv);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function () {
        deleteTask(task.id);
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    taskDiv.appendChild(infoDiv);
    taskDiv.appendChild(actionsDiv);

    return taskDiv;
}

function completeTask(id) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = true;
        task.completedAt = new Date().toLocaleString();

        saveTasks();
        displayTasks();
    }
}

function editTask(id, infoDiv) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const oldText = task.text;

    infoDiv.innerHTML = "";

    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = oldText;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "complete-btn";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "delete-btn";

    const buttonBox = document.createElement("div");
    buttonBox.className = "task-actions";

    buttonBox.appendChild(saveBtn);
    buttonBox.appendChild(cancelBtn);

    infoDiv.appendChild(input);
    infoDiv.appendChild(buttonBox);

    saveBtn.onclick = function () {
        const newText = input.value.trim();

        if (newText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = newText;

        saveTasks();
        displayTasks();
    };

    cancelBtn.onclick = function () {
        displayTasks();
    };

    input.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();