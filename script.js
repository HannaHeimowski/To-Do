// Stelle sicher, dass der Zustand beim Laden der Seite wiederhergestellt wird
document.addEventListener("DOMContentLoaded", () => {
  loadListsFromStorage();
});

document.querySelector("#newList").onclick = createNewList;

// Funktion, um eine neue Liste zu erstellen
function createNewList() {
  const listsContainer = document.getElementById("listsContainer");
  const listName = prompt("Gib den Namen für die neue Liste ein:");
  if (!listName || listName.trim() === "") {
    alert("Der Listenname darf nicht leer sein.");
    return;
  }

  const listDiv = createListElement(listName);
  listsContainer.appendChild(listDiv);

  // Zustand speichern
  saveListsToStorage();
}

// Funktion, um das DOM-Element einer Liste zu erstellen
function createListElement(listName) {
  const listDiv = document.createElement("div");
  listDiv.classList.add("list");
  listDiv.innerHTML = `
    <div class="list-header">
      <div class="list-row">
        <h2 class="list-title">${listName}</h2>
        <div class="list-buttons">
          <button class="editList"><i class="fas fa-edit"></i></button>
          <button class="deleteList"><i class="far fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
    <div class="newtask">
      <input type="text" placeholder="Task to be done .." />
      <button class="addTask">Add</button>
    </div>
    <div class="tasks"></div>
  `;
  setupListHeaderEvents(listDiv);
  setupTaskFunctionality(listDiv);
  return listDiv;
}

// Event-Listener für Listen und Tasks setzen
function setupListHeaderEvents(listDiv) {
  listDiv.querySelector(".editList").onclick = () => {
    editListName(listDiv.querySelector(".list-title"));
    saveListsToStorage();
  };
  listDiv.querySelector(".deleteList").onclick = () => {
    listDiv.remove();
    saveListsToStorage();
  };
}

function setupTaskFunctionality(listDiv) {
  const taskInput = listDiv.querySelector(".newtask input");
  const addTaskButton = listDiv.querySelector(".addTask");
  const tasksContainer = listDiv.querySelector(".tasks");

  addTaskButton.onclick = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      alert("Please enter a Task");
      return;
    }
    addTask(tasksContainer, taskText);
    taskInput.value = "";
    saveListsToStorage();
  };
}

function addTask(tasksContainer, taskText) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.innerHTML = `
    <span class="taskname">${taskText}</span>
    <div class="task-buttons">
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="far fa-trash-alt"></i></button>
    </div>
  `;
  tasksContainer.appendChild(taskDiv);
  attachTaskEvents(taskDiv);
}

function attachTaskEvents(taskDiv) {
  taskDiv.querySelector(".delete").onclick = () => {
    taskDiv.remove();
    saveListsToStorage();
  };

  taskDiv.querySelector(".edit").onclick = () => {
    editTask(taskDiv);
    saveListsToStorage();
  };

  taskDiv.onclick = (e) => {
    if (!e.target.closest(".task-buttons")) {
      taskDiv.classList.toggle("completed");
      saveListsToStorage();
    }
  };
}

// Lokale Speicherfunktion
function saveListsToStorage() {
  const listsContainer = document.getElementById("listsContainer");
  const lists = [];

  listsContainer.querySelectorAll(".list").forEach((listDiv) => {
    const listName = listDiv.querySelector(".list-title").textContent;
    const tasks = [];

    listDiv.querySelectorAll(".task").forEach((taskDiv) => {
      const taskName = taskDiv.querySelector(".taskname").textContent;
      const completed = taskDiv.classList.contains("completed");
      tasks.push({ taskName, completed });
    });

    lists.push({ listName, tasks });
  });

  localStorage.setItem("todoLists", JSON.stringify(lists));
}

function loadListsFromStorage() {
  const storedLists = localStorage.getItem("todoLists");
  if (storedLists) {
    const listsContainer = document.getElementById("listsContainer");
    const lists = JSON.parse(storedLists);

    lists.forEach((list) => {
      const listDiv = createListElement(list.listName);
      const tasksContainer = listDiv.querySelector(".tasks");

      list.tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        if (task.completed) taskDiv.classList.add("completed");

        taskDiv.innerHTML = `
          <span class="taskname">${task.taskName}</span>
          <div class="task-buttons">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="delete"><i class="far fa-trash-alt"></i></button>
          </div>
        `;
        attachTaskEvents(taskDiv);
        tasksContainer.appendChild(taskDiv);
      });

      listsContainer.appendChild(listDiv);
    });
  }
}
