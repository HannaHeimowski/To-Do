document.addEventListener("DOMContentLoaded", loadListsFromStorage);

document.querySelector("#newList").onclick = createNewList;

// Funktion zum Erstellen einer neuen Liste
function createNewList() {
  const listName = prompt("Gib den Namen für die neue Liste ein:");
  if (!listName || listName.trim() === "") {
    alert("Der Listenname darf nicht leer sein.");
    return;
  }

  const listDiv = createListElement(listName);
  document.getElementById("listsContainer").appendChild(listDiv);
  saveListsToStorage(); // Speichern, nachdem eine neue Liste erstellt wurde
}

// Funktion zum Erstellen eines Listenelements
function createListElement(listName) {
  const listDiv = document.createElement("div");
  listDiv.classList.add("list");

  listDiv.innerHTML = `
    <div class="list-header">
      <h2 class="list-title">${listName}</h2>
      <div class="list-buttons">
        <button class="editList"><i class="fas fa-edit"></i></button>
        <button class="deleteList"><i class="far fa-trash-alt"></i></button>
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

// Event-Listener für Listen-Header setzen
function setupListHeaderEvents(listDiv) {
  // Editierfunktion für den Listennamen
  listDiv.querySelector(".editList").onclick = () => {
    editListName(listDiv.querySelector(".list-title"));
    saveListsToStorage();
  };
  
  // Löschen der Liste
  listDiv.querySelector(".deleteList").onclick = () => {
    listDiv.remove();
    saveListsToStorage();
  };
}

// Funktion zum Bearbeiten des Listennamens
function editListName(titleElement) {
  const newName = prompt("Gib einen neuen Namen für die Liste ein:", titleElement.textContent);
  if (newName && newName.trim() !== "") {
    titleElement.textContent = newName;
  } else {
    alert("Der Listenname darf nicht leer sein.");
  }
}

// Event-Listener für Aufgaben
function setupTaskFunctionality(listDiv) {
  const taskInput = listDiv.querySelector(".newtask input");
  const addTaskButton = listDiv.querySelector(".addTask");
  const tasksContainer = listDiv.querySelector(".tasks");

  addTaskButton.onclick = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      alert("Bitte gebe eine Aufgabe ein!");
      return;
    }
    addTask(tasksContainer, taskText);
    taskInput.value = "";
    saveListsToStorage();
  };
}

// Aufgabe hinzufügen
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

// Event-Listener für Tasks
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

// Funktion zum Bearbeiten einer Aufgabe
function editTask(taskDiv) {
  const taskName = taskDiv.querySelector(".taskname");
  const newTaskName = prompt("Bearbeite die Aufgabe:", taskName.textContent);
  if (newTaskName && newTaskName.trim() !== "") {
    taskName.textContent = newTaskName;
  } else {
    alert("Der Aufgabenname darf nicht leer sein.");
  }
}

// Speichern von Listen und Aufgaben im lokalen Speicher
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

// Laden der gespeicherten Listen aus dem lokalen Speicher
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
