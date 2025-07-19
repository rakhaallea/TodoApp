const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const today = new Date();
const currentMonth = monthNames[today.getMonth()];
const currentYear = today.getFullYear();

// init todo array
const todos = [];

// Custom Event
const RENDER_EVENT = "render-todo";

// local Storage Name
const STORAGE_KEY = "todos";

// check local storage support in browser
const isStorageExist = () => {
    if (typeof Storage === undefined) {
        alert(`browser can't support local storage`);
        return false;
    }

    return true;
};

// load and get data from locaalstorage
const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        };
    };
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// save todo to localstorage
const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
    };
};

// elemen button to show up and show off form submit
const submitForm = document.querySelector('#form-todo');
const buttonCancel = document.querySelector(".btn-cancel");
const buttonAddTask = document.querySelector(".add-task");

buttonAddTask.addEventListener("click", () => {
    submitForm.style.display = "block";
});

buttonCancel.addEventListener("click", () => {
    submitForm.style.display = "none";
});

// Set <p class="set-month"> dan <p class="set-year">
document.querySelector(".set-month").textContent = currentMonth;
document.querySelector(".set-year").textContent = currentYear;

// Elemen container date-days
const dateDaysContainer = document.querySelector(".date-days");
dateDaysContainer.innerHTML = "";

const totalDays = 7; // total kotak
const middleIndex = Math.floor(totalDays / 2); // index ke-3 (hari ini)

for (let i = 0; i < totalDays; i++) {
    const offset = i - middleIndex; // nilai negatif ke positif
    const date = new Date();
    date.setDate(today.getDate() + offset); // hari sebelum & sesudah

    const dayName = dayNames[date.getDay()];
    const dayNumber = date.getDate();

    const box = document.createElement("div");
    box.classList.add("box");

    if (offset === 0) {
        box.classList.add("active"); // hari ini = active
    }

    box.innerHTML = `
            <p class="text-month">${dayName}</p>
            <p class="text-date">${dayNumber}</p>
        `;

    dateDaysContainer.appendChild(box);
}

// Scroll agar hari ini berada di tengah
setTimeout(() => {
    const activeBox = document.querySelector(".box.active");
    if (activeBox) {
        activeBox.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }
}, 100);

// Generate Id Todo
const getID = (function () {
    let counter = 1;

    return function () {
        const id = `T${counter.toString().padStart(3, '0')}`;
        counter++;
        return id;
    };
})();

// Function find todo By ID
const findTodo = (id) => {
    for (const todoItem of todos) {
        if (todoItem.id === id) {
            return todoItem;
        };
    };
    return null
};

// Function find todo By ID
const findTodoIndex = (id) => {
    for (const index in todos) {
        if (todos[index].id === id) {
            return index;
        };
    };
    return null
};

// Generate object todo
const generateTodoObject = (id, task, date, priority, createdAt, isCompleted) => {
    return {
        id,
        task,
        date,
        priority,
        createdAt,
        isCompleted
    }
}

const filterTodos = (keyword) => {
    return todos.filter(todo => todo.task.toLowerCase().includes(keyword));
};

// Function addTodo push todo to todos
const addTodo = () => {
    const inputTodo = document.querySelector("#your-todo").value;
    const inputDate = document.querySelector("#todo-date").value;
    const inputPriority = document.querySelector("#todo-priority").value;

    const now = new Date();
    const jam = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const createdAt = `${jam}:${minutes}`;

    const generateID = getID();
    const todoObject = generateTodoObject(generateID, inputTodo, inputDate, inputPriority, createdAt, false);

    todos.push(todoObject);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// Function add ToDo To Completed
const addToCompleted = (todoID) => {
    const todoTarget = findTodo(todoID);
    // console.log("Found todo:", todoTarget);

    if (todoTarget === null) return;

    todoTarget.isCompleted = true;
    Swal.fire({
        title: "Done!",
        icon: "success",
        draggable: true
    });
    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function undo ToDo To Todo
const undoTodo = (todoID) => {
    const todoTarget = findTodo(todoID);

    if (todoTarget === null) return;

    todoTarget.isCompleted = false;
    Swal.fire({
        title: "Back to Todo!",
        icon: "success",
        draggable: true
    });
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function undo ToDo To Todo
const deleteTodo = (todoID) => {
    const todoTarget = findTodoIndex(todoID);

    if (todoTarget === null) return;

    todos.splice(todoTarget, 1);
    Swal.fire({
        title: "Delete success!",
        icon: "success",
        draggable: true
    });
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function Delete all todos
const deleteAllTodos = () => {
    todos.length = 0;
    Swal.fire({
        title: "Delete all success!",
        icon: "success",
        draggable: true
    });
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeTodo = (todoObject) => {
    const todoTitle = document.createElement("h3");
    todoTitle.classList.add('card-title');
    todoTitle.innerText = todoObject.task;

    const textPriority = document.createElement("p");
    textPriority.classList.add('priority');
    textPriority.classList.add(todoObject.priority);
    textPriority.innerText = todoObject.priority;

    const textDate = document.createElement("p");
    textDate.classList.add('date');
    textDate.innerText = todoObject.date;
    textDate.dataset.id = todoObject.id;

    const textTime = document.createElement("p");
    textTime.classList.add('time');
    textTime.innerText = todoObject.createdAt;

    const leftCardContainer = document.createElement("div");
    leftCardContainer.classList.add("left-card");
    const rightCardContainer = document.createElement("div");
    rightCardContainer.classList.add("right-card");

    const cardBodyContainer = document.createElement("div");
    cardBodyContainer.classList.add('card-body')
    cardBodyContainer.append(textPriority, textDate, textTime);

    leftCardContainer.append(todoTitle, cardBodyContainer);

    // Button delete per item card
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("material-symbols-outlined");
    buttonDelete.classList.add("danger");
    buttonDelete.innerText = "delete";

    buttonDelete.addEventListener('click', () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#687FE5",
            cancelButtonColor: "#FF3F33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTodo(todoObject.id);
            }
        });
    });

    // Condition button card todo
    if (todoObject.isCompleted) {
        const buttonChecked = document.createElement("button");
        buttonChecked.classList.add("material-symbols-outlined");
        buttonChecked.classList.add("checked");
        buttonChecked.innerText = "check_circle";

        buttonChecked.addEventListener('click', () => {
            undoTodo(todoObject.id);
        });
        rightCardContainer.append(buttonDelete, buttonChecked);
    } else {

        const buttonUnChecked = document.createElement("button");
        buttonUnChecked.classList.add("material-symbols-outlined");
        buttonUnChecked.innerText = "circle";

        buttonUnChecked.addEventListener('click', () => {
            // console.log(`Marking ${todoObject.id} as completed`);
            addToCompleted(todoObject.id);
        });

        rightCardContainer.append(buttonDelete, buttonUnChecked);
    }

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    cardContainer.append(leftCardContainer, rightCardContainer);

    return cardContainer;

};

// DOMContentLoaded and submit form
document.addEventListener('DOMContentLoaded', () => {
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();

        submitForm.reset();
        submitForm.style.display = "none";
    });

    // Button Delete all todos
    const buttonDeleteAll = document.querySelector('.btn-delete');
    buttonDeleteAll.addEventListener('click', () => {
        if (confirm("apakah anda yakin menghapus semua todos?")) {
            deleteAllTodos();
        };
    });

    // button search pada navbar
    const iconSearch = document.querySelector('.search');
    const inputSearch = document.querySelector('.input-search');
    const monthYear = document.querySelector('.month-year');

    inputSearch.addEventListener("input", (e) => {
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    iconSearch.addEventListener('click', () => {
        if (inputSearch.style.display === "none" || inputSearch.style.display === "") {
            inputSearch.style.display = "inline-block";
            monthYear.style.display = 'none';
        } else {
            inputSearch.style.display = "none";
            monthYear.style.display = 'flex';
        }
    });

    // button open & close profile
    const profileIcon = document.querySelector(".open-profile");
    const profileContainer = document.querySelector(".profile");
    const buttonClosed = document.querySelector(".closed");

    profileIcon.addEventListener('click', () => {
        if (profileContainer.style.display === "none" || profileContainer.style.display === "") {
            profileContainer.style.display = "block";
        } else {
            profileContainer.style.display = "none";
        }
    });
    buttonClosed.addEventListener('click', () => {
        if (profileContainer.style.display === "block" || profileContainer.style.display === "") {
            profileContainer.style.display = "none";
        } else {
            profileContainer.style.display = "block";
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


// Render elemen card todo
document.addEventListener(RENDER_EVENT, () => {
    const unCompletedTodo = document.querySelector("#todo-container");
    unCompletedTodo.innerHTML = "";

    const completedTodo = document.querySelector("#todo-completed-container");
    completedTodo.innerHTML = "";

    // Search Todo
    const inputSearch = document.querySelector('.input-search');
    const keyword = inputSearch.value.toLowerCase();

    let filteredTodos = todos;
    if (keyword.trim() !== "") {
        filteredTodos = filterTodos(keyword);
    }

    // title todo & todo completed
    const titleTodo = document.querySelector(".title-todo");
    const titleTodoCompleted = document.querySelector(".title-completed");

    const activeTodos = filteredTodos.filter(todo => !todo.isCompleted);
    const completedTodos = filteredTodos.filter(todo => todo.isCompleted);

    for (const todoItem of filteredTodos) {
        const todoCard = makeTodo(todoItem);

        if (todoItem.isCompleted) {
            completedTodo.append(todoCard);
        } else {
            unCompletedTodo.append(todoCard);
        };
    };

    titleTodo.textContent = `To Do (${activeTodos.length})`;
    titleTodoCompleted.textContent = `Completed (${completedTodos.length})`;

    // condition overdue or late 
    const elementDate = document.querySelectorAll('.date');
    const today = new Date();

    // clear time
    today.setHours(0, 0, 0, 0);

    elementDate.forEach((el, index) => {
        const textTgl = el.textContent.trim();
        const dateObj = new Date(textTgl);

        // check format date
        if (!isNaN(dateObj.getTime())) {
            // clear time too
            dateObj.setHours(0, 0, 0, 0);

            const id = el.dataset.id;
            const todo = filteredTodos.find(t => t.id === id)

            if (todo && !todo.isCompleted && dateObj < today) {
                el.style.color = "red"; // overdue
            }
        }
    });
});

