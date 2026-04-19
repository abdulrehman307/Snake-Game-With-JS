
const todo = document.querySelector("#todo");
const inProgress = document.querySelector("#progress");
const done = document.querySelector("#done");
let dragElement = null;

const columns = [todo, inProgress, done];

// 1. Helper Function: Naya Task Div banane ke liye (Yehi miss ho gaya tha aapse!)
function createTaskElement(title, desc) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = ` 
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">delete</button>
    `;

    // Is naye div pe dragstart lagana zaroori hai
    div.addEventListener("dragstart", () => {
        dragElement = div;
    });

    // Delete button logic
    const deleteBtn = div.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
        saveToLocalStorage(); 
    });

    return div;
}

// 2. Drag & Drop logic
function addDragEventListeners(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });
    
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });
     
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    
    column.addEventListener("drop", (e) => {
        e.preventDefault();
        if(dragElement) {
            column.appendChild(dragElement);
            column.classList.remove("hover-over");
            
            updateTaskCount();
            saveToLocalStorage();
        }
    });
}

addDragEventListeners(todo);
addDragEventListeners(inProgress);  
addDragEventListeners(done);

// 3. Pehle se mojood tasks pe drag event lagana
const existingTasks = document.querySelectorAll('.task');
existingTasks.forEach(task => {
    task.addEventListener("dragstart", () => {
        dragElement = task;
    });
});

// 4. Modal aur UI elements
const addtaskbutton = document.querySelector("#add-task-toggle");
const modal = document.querySelector(".modal");
const modalbg = document.querySelector(".modal .bg");
const addtaskinputbutton = document.querySelector(".add-new-task");

addtaskbutton.addEventListener("click", () => {
    modal.classList.add("active");
});

modalbg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// 5. Naya Task Add Karna (Button Click)
addtaskinputbutton.addEventListener("click", () => {
    const tasktitle = document.querySelector("#task-title").value;
    const taskdesc = document.querySelector("#Description").value;
    
    // Agar dono inputs khali hon toh task na bane
    if(!tasktitle.trim() || !taskdesc.trim()) return alert("Dono fields fill karein!");

    // Helper function call kiya
    const newTask = createTaskElement(tasktitle, taskdesc);
    
    todo.appendChild(newTask);
    modal.classList.remove("active");
    
    updateTaskCount();
    saveToLocalStorage();
    
    document.querySelector("#task-title").value = "";
    document.querySelector("#Description").value = "";
});

// 6. Count Update Logic
function updateTaskCount() {
    columns.forEach(col => {
        const columnTasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        if (count) { 
            count.innerHTML = columnTasks.length;
        }
    });
}

// 7. Save to Local Storage
function saveToLocalStorage() {
    const taskData = {
        todo: [],
        progress: [],
        done: []
    };

    columns.forEach(col => {
        const colId = col.id; 
        const tasksInCol = col.querySelectorAll(".task");

        tasksInCol.forEach(task => {
            const title = task.querySelector("h2").innerText;
            const desc = task.querySelector("p").innerText;
            taskData[colId].push({ title, desc }); 
        });
    });

    localStorage.setItem("kanbanBoardData", JSON.stringify(taskData));
}

// 8. Load from Local Storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("kanbanBoardData");
    
    if (savedData) {
        const taskData = JSON.parse(savedData);

        for (const colId in taskData) {
            const column = document.getElementById(colId);
            const tasksArray = taskData[colId]; 

            tasksArray.forEach(taskObj => {
                // Yahan wahi helper function dobara use ho raha hai
                const newTask = createTaskElement(taskObj.title, taskObj.desc);
                column.appendChild(newTask);
            });
        }
    }
}

// 9. Initial Load Calls 
loadFromLocalStorage();
updateTaskCount();