// create global array for recording tasks
let myTasks = [];

//declare DOM elements
const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-list");

//create function to load the tasks from localstorage
loadTasks();
function loadTasks() {
    const storedTasks = localStorage.getItem("myTasks");
    if (storedTasks) {
        myTasks = JSON.parse(storedTasks);
        renderTasks(myTasks);
    }else { //if no data there is nothing to be saved
        myTasks = [];
    }

    renderTasks(myTasks);
}

//function to save tasks to local storage
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(myTasks));
}
//Rebuilds the task card from data in local storage
function renderTasks(tasks) {
    taskContainer.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-item", task.priority);

        if (task.isCompleted)taskCard.classList.add("completed");
        // css for the task card
        taskCard.innerHTML = ` 
            <div>
                <p><strong>Description: </strong><span>${task.description}</span></p>
            </div>
            <div class="task-actions">
                <button class="toggle-btn" data-id="${task.id}"> Toggle Status</button>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `
        //this connects the task card to the html
        taskContainer.appendChild(taskCard);
    });
}

//function to handle saving the form submission then save and display the tasks
function handleAddTask(e) {
    //prevent the default form submission behavior
    e.preventDefault();
    
    const description = document.getElementById("task-title").value;
    const priority = document.getElementById("task-priority").value;

    const newTask = {
    id: Date.now(),
    description,
    priority,
    isCompleted: false 
    //false by default, will be toggled to true when the task is completed
    };

    //push the object to the array
    myTasks.push(newTask);
    //calls the savefunction to save the tasks to local storage
    saveTasks();
    renderTasks(myTasks);
    
    taskForm.reset(); // Reset the form after submission
}
//function to handle delete and toggle task status
function handleTaskAction(e) {
    if (!e.target.matches("button"))return; // Ignore clicks that are not on buttons

    const taskId = parseInt(e.target.dataset.id);
    if(e.target.classList.contains("delete-btn")) {
        //filter in this line looks for a single element that makes the function return true
        myTasks = myTasks.filter( (task) => task.id !== taskId);
    }else if (e.target.classList.contains("toggle-btn")) {
        myTasks = myTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, isCompleted: !task.isCompleted };
            }
            return task;
        });
    }
    saveTasks();
    renderTasks(myTasks);
}

//event handler
taskForm.addEventListener('submit', handleAddTask);
taskContainer.addEventListener('click', handleTaskAction);
