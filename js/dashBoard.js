const curUserId = new URLSearchParams(window.location.search).get("id");
sessionStorage.setItem("curUserId", curUserId);
getUserName()
renderProjects()

document.getElementById("edit-task-btn").addEventListener("click", e =>
  {
    document.getElementById("task-edit-done").classList.remove("hidden")
  
      var val = document.getElementById("curTaskTitle").innerText;
      var input=document.createElement("input");
      input.id = "title-selector"
      input.value=val;
      document.getElementById("curTaskTitle").innerText="";
      document.getElementById("curTaskTitle").appendChild(input);
      val = document.getElementById("curTaskDesc").innerText;
      var newinput =document.createElement("input"); 
      newinput.id = "description-selector"
      newinput.value = val;
      document.getElementById("curTaskDesc").innerText="";
      document.getElementById("curTaskDesc").appendChild(newinput);
      const due_date = document.getElementById("curTaskDueDate");
      val = due_date.innerText;
      let thirdinput = document.createElement("input");
      thirdinput.id = "date-selector"
      thirdinput.type = "date";
      thirdinput.value = val;
      document.getElementById("curTaskDueDate").innerText = ""
      document.getElementById("curTaskDueDate").appendChild(thirdinput)
      let selecter = document.createElement("select")
      selecter.id = "status-selector"
      let statuss = document.getElementById("curTaskStatus")
      let option1 = document.createElement("option")
      option1.value = "to-do";
      option1.innerText = "to-do";
      selecter.appendChild(option1)
      let option2 = document.createElement("option")
      option2.value = "in-progress";
      option2.innerText = "in-progress";
      selecter.appendChild(option2)
      let option3 = document.createElement("option")
      option3.value = "done";
      option3.innerText = "done";
      selecter.appendChild(option3);
      selecter.value = statuss.innerText
      statuss.innerText = "";
      statuss.appendChild(selecter)
  }
)
document.getElementById("task-edit-done").addEventListener("click", () =>
{
  document.getElementById("task-edit-done").classList.add("hidden");
  EditTask();
})
async function getUserName() 
{
  const response = await fetch(`http://localhost:3000/users/${curUserId}`)
  const data = await response.json()
  document.getElementById("greeting").innerText = "Welcome " + data.fname
}
async function createProject() {
  const curUserId = new URLSearchParams(window.location.search).get("id");
  const response1 = await fetch(`http://localhost:3000/users/${curUserId}`);
  const userData = await response1.json();
  let newPorject = {
    id: userData.Projects.length,
    // title: document.getElementById("projectTitle").value, // Change to dom controllers
    title: "hi", // Change to dom controllers
    description: "", //document.getElementById("projectDescription").value, // Change to dom controllers
    create_date: new Date().toLocaleDateString(), // Change to dom controllers
    tasks: [],
  };
  userData.Projects.push(newPorject);

  await fetch(`http://localhost:3000/users/${curUserId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // Append child to aside that have the project name & three dots button
  const projectList = document.getElementById("project-display");
  const projectItem = document.createElement("div");
  projectItem.classList.add("project-item");

  const projectName = document.createElement("span");
  projectName.textContent = newPorject.title;

  const projectMenu = document.createElement("button");
  projectMenu.textContent = "...";
  projectMenu.classList.add("project-menu");

  projectItem.appendChild(projectName);
  projectItem.appendChild(projectMenu);
  projectList.appendChild(projectItem);

  // When click on this div it will appear the number of tasks for each status
  projectItem.addEventListener("click", () => {
    const taskSummary = document.getElementById("taskSummary");
    taskSummary.innerHTML = `To Do: ${
      newPorject.tasks.filter((task) => task.status === "To Do").length
    }
      In Progress: ${
        newPorject.tasks.filter((task) => task.status === "In Progress").length
      }
      Done: ${
        newPorject.tasks.filter((task) => task.status === "Done").length
      }`;
  });

  // When click on this div it will appear the project details
  projectItem.addEventListener("click", () => {
    const projectDetails = document.getElementById("projectDetails");
    projectDetails.innerHTML = `
      <h3>${newPorject.title}</h3>
      <p>${newPorject.description}</p>
      <p>${newPorject.content}</p>
      <p>Created on: ${newPorject.create_date}</p>
    `;
  });
}

// const taskButtons = document.querySelectorAll(".task-button");
// taskButtons.forEach((taskButton) => {
//   taskButton.addEventListener("click", handleTaskClick);
// });

let addTaskBtn = document.getElementById("addTask");
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", function (event) {
    event.preventDefault();
    createTask(1);
  });

  addTaskBtn.addEventListener("click", () => {
    if (activeOverlay) {
      activeOverlay.classList.add("hide");
      activeOverlay = null;
      document.body.classList.remove("overflow-hidden");
    }
  });
}
function handleTaskClick(id,title,desc,due_date,status) {
  if (viewTaskOverlay) {
    viewTaskOverlay.classList.remove("hide")
    document.getElementById("curTaskId").textContent=id;
    document.getElementById("curTaskTitle").textContent = title;
    document.getElementById("curTaskDesc").textContent = desc;
    document.getElementById("curTaskDueDate").textContent=due_date;
    document.getElementById("curTaskStatus").textContent=status;
    activeOverlay = viewTaskOverlay;
    document.body.classList.add("overflow-hidden");
  }
}

async function createTask() {
  const curUserId = sessionStorage.getItem("curUserId");
  if (!curUserId) {
    console.error("User ID is null");
    return;
  }
  const radioViewOptions = document.querySelectorAll("input[name='view-option']");
  let ProjectId = 0;
  radioViewOptions.forEach( (radio, index) => 
    {
      if(radio.checked) ProjectId = index;
    }
  )
  let taskTitle = document.getElementById("name").value;
  let taskDesc = document.getElementById("description").value;
  let taskDueDate = document.getElementById("Duedate").value;
  let taskStatus = document.getElementById("drp-li").value;

  try {
    const response = await fetch(`http://localhost:3000/users/${curUserId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const userData = await response.json();
    console.log(userData)
    const newTask = {
      id: userData.Projects[ProjectId].tasks.length,
      taskTitle: taskTitle,
      description: taskDesc,
      due_date: taskDueDate,
      status: taskStatus,
      history: [
        {
          status: taskStatus,
          date: new Date().toLocaleDateString(),
        },
      ],
    };

    // console.log(newTask);
    userData.Projects[ProjectId].tasks.push(newTask);

    const updateResponse = await fetch(
      `http://localhost:3000/users/${curUserId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Projects: userData.Projects }),
      }
    );
    if (!updateResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const content = `<li class="task-item">
                <button class="task-button">
                  <p class="task-name">${newTask.taskTitle}</p>
                  <p class="task-due-date">Due on ${newTask.due_date}</p>
                  <iconify-icon icon="material-symbols:arrow-back-ios-rounded" style="color: black" width="18" height="18" class="arrow-icon"></iconify-icon>
                </button>
              </li>`;
    const myNewTask = document.createElement("div");
    myNewTask.innerHTML = content;

    let newTaskElement;
    if (newTask.status == "to-do") {
      const ulTo_do = document.getElementById("ulTo-do");
      newTaskElement = ulTo_do.appendChild(myNewTask.firstElementChild);
    } else if (newTask.status == "in-progress") {
      const ulDoing = document.getElementById("ulDoing");
      newTaskElement = ulDoing.appendChild(myNewTask.firstElementChild);
    } else {
      const ulDone = document.getElementById("ulDone");
      newTaskElement = ulDone.appendChild(myNewTask.firstElementChild);
    }
    if (newTaskElement) {
      newTaskElement
        .querySelector(".task-button")
        .addEventListener("click", () => {
          handleTaskClick(newTask.id,newTask.taskTitle,newTask.description,newTask.due_date,newTask.status)
        });
    }

    document.getElementById("addTaskForm").reset();
  } catch (error) {
    console.error("Error:", error);
  }
}


async function EditTask() {
  const curUserId = new URLSearchParams(window.location.search).get("id");
  const response1 = await fetch(`http://localhost:3000/users/${curUserId}`);
  const userData = await response1.json();
  const radioViewOptions = document.querySelectorAll("input[name='view-option']");
  let curProjectId = 0;
  radioViewOptions.forEach( (radio, index) => 
    {
      if(radio.checked) curProjectId = index;
    }
  )
  let ProjectId = curProjectId; //Get it somehow
  let taskId = document.getElementById("curTaskId").innerHTML
  var currentTask = userData.Projects[ProjectId].tasks[taskId]
  //Get it somehow
  // let editedProperty = "taskTitle"; //get it from poperty selected
  // let newEdit = "edited-Title"; // get this from dom
  // if (editedProperty == "status") {
    //   if (newEdit == "In Progress") {
      //     userData.Projects[ProjectId].tasks[taskId]["progress_date"].push({
        //       date: new Date().toLocaleDateString(),
        //       status: newEdit,
        //     });
        //   } else if (newEdit == "Done") {
          //     userData.Projects[ProjectId].tasks[taskId]["done_date"].push({
            //       date: new Date().toLocaleDateString(),
            //       status: newEdit,
            //     });
            //   }
            // }
            let newTask = {}
  if(document.getElementById("status-selector").value == currentTask.status) {
    newTask = {
      id: currentTask.id,
      taskTitle: document.getElementById("title-selector").value,
      description: document.getElementById("description-selector").value,
      due_date: document.getElementById("date-selector").value,
      status: document.getElementById("status-selector").value,
      history: [
        {
          status: document.getElementById("status-selector").value,
          date: new Date().toLocaleDateString(),
        },
      ],
    };
  }
  else {
    newTask = {
      id: currentTask.id,
      taskTitle: document.getElementById("title-selector").value,
      description: document.getElementById("description-selector").value,
      due_date: document.getElementById("date-selector").value,
      status: document.getElementById("status-selector").value,
      history: currentTask.history.push({
        status: document.getElementById("status-selector").value,
        date: new Date().toLocaleDateString(),
      })
    };
  }

  userData.Projects[ProjectId].tasks[taskId] = newTask;
  // console.log(userData.Projects[id].tasks)
  fetch(`http://localhost:3000/users/${curUserId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

async function EditProject(project_id, edited_property, edited_value) {
  const curUserId = new URLSearchParams(window.location.search).get("id");
  const response1 = await fetch(`http://localhost:3000/users/${curUserId}`);
  const userData = await response1.json();
  let ProjectId = project_id; //Get it somehow
  let editedProperty = edited_property; //get it from poperty selected
  let newEdit = edited_value; // get this from dom
  // console.log(userData.Projects[ProjectId][editedProperty])
  userData.Projects[ProjectId][editedProperty] = newEdit;
  // console.log(userData.Projects[id].tasks)
  fetch(`http://localhost:3000/users/${curUserId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

async function deletproject(project_id) {
  const userid = new URLSearchParams(window.location.search).get("id");
  const getlastdata = await fetch(`http://localhost:3000/users/${userid}`);
  const returntojson = await getlastdata.json();
  const ProjectID = project_id; //getfrom dom
  returntojson.Projects = returntojson.Projects.filter(
    (cutproject) => cutproject.id !== ProjectID
  );
  returntojson.Projects.forEach((element, index) => {
    element.id = index;
  });
  await fetch(`http://localhost:3000/users/${userid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(returntojson),
  });
}

async function deleteTask(task_id, project_id) {
  const userid = new URLSearchParams(location.search).get("id");
  const getlastdata = await fetch(`http://localhost:3000/users/${userid}`);
  const returntojson = await getlastdata.json();
  const ProjectID = project_id; //get from dom
  const taskesindex = task_id; //get from dom
  returntojson.Projects[ProjectID].tasks = returntojson.Projects[
    ProjectID
  ].tasks.filter((cuttaskes) => cuttaskes.id !== taskesindex);
  returntojson.Projects[ProjectID].tasks.forEach((element, index) => {
    element.id = index;
  });
  await fetch(`http://localhost:3000/users/${userid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(returntojson),
  });
}

async function renderTasks(proj_Id) {
  ProjectId = proj_Id;   //To get
  const response = await fetch(`http://localhost:3000/users/${curUserId}`)
  const userData = await response.json();
  document.getElementById("ulTo-do").innerHTML = ""
  document.getElementById("ulDoing").innerHTML = ""
  document.getElementById("ulDone").innerHTML = ""
  userData.Projects[ProjectId].tasks.forEach(element => {
    const content = `<li class="task-item">
                <button class="task-button">
                  <p class="task-name">${element.taskTitle}</p>
                  <p class="task-due-date">Due on ${element.due_date}</p>
                  <iconify-icon icon="material-symbols:arrow-back-ios-rounded" style="color: black" width="18" height="18" class="arrow-icon"></iconify-icon>
                </button>
              </li>`;
    const myNewTask = document.createElement("div");
    myNewTask.innerHTML = content;
    let newTaskElement;
    if (element.status == "to-do") {
      const ulTo_do = document.getElementById("ulTo-do");
      newTaskElement = ulTo_do.appendChild(myNewTask.firstElementChild);
    } else if (element.status == "in-progress") {
      const ulDoing = document.getElementById("ulDoing");
      newTaskElement = ulDoing.appendChild(myNewTask.firstElementChild);
    } else {
      const ulDone = document.getElementById("ulDone");
      newTaskElement = ulDone.appendChild(myNewTask.firstElementChild);
    }
    if (newTaskElement) {
      newTaskElement
        .querySelector(".task-button")
        .addEventListener("click", () => {
          handleTaskClick(element.id,element.taskTitle,element.description,element.due_date,element.status)
        });
    }
  }
  )
  displayProjectDesc()
}

  async function renderProjects() {
    const response = await fetch(`http://localhost:3000/users/${curUserId}`)
    const data = await response.json()
    let template = ''
    data.Projects.forEach( project => {
      template += `
      <div class="radio-container">
            <input
              type="radio"
              id="${project.id}"
              name="view-option"
              value= "${project.id}"
              class="radio-input"
              checked
            />
            <label for="${project.id}" class="radio-label">
              <span>${project.title}</span>
            </label>
          </div>`
    })
    const projectsContainer = document.getElementById("project-display");
    projectsContainer.innerHTML = template;
    const radioViewOptions = document.querySelectorAll("input[name='view-option']");
    radioViewOptions.forEach( radio =>
      {
        radio.addEventListener("change", e => {
          renderTasks(e.target.id)
        })
      }
    )
    displayProjectDesc()
  }
// document.getElementById("search-bar").addEventListener('keyup', e => 
//   {

//   }
// )
async function wipeUserProjects() {
  //idk if this is really needed ngl
}

// Rasha's work:

// document
//   .getElementById(`project${id}`)
//   .addEventListener("click", getProjectDetails());

// document.getElementById(`project${id}`).addEventListener("click",getProjectDetails())

async function getProjectDetails() {
  // get data for project i clicked on it
  // display this data on page
}
// async function createTask() {
//   const curUserId = new URLSearchParams(window.location.search).get("id");
//   const response1 = await fetch(`http://localhost:3000/users/${curUserId}`);
//   const userData = await response1.json();
//   let id = 1; //Get it somehow
//   let newTask = {
//     id: userData.Projects[id].tasks.length,
//     taskTitle: "testt",
//     description: "testd",
//     due_date: "test22",
//     status: "testok",
//     content: "testcont",
//     create_date: "testcreate",
//   };
//   userData.Projects[id].tasks.push(newTask);
//   // console.log(userData.Projects[id].tasks)
//   let edit = {
//     Projects: userData.Projects,
//   };
//   fetch(`http://localhost:3000/users/${curUserId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(edit),
//   });
// }

async function displayProjectDesc() {
  // get the current project id
  const radioViewOptions = document.querySelectorAll("input[name='view-option']");
  let curProjectId = 0;
  radioViewOptions.forEach( (radio, index) => 
    {
      if(radio.checked) curProjectId = index;
    }
  )
  const curUserId = new URLSearchParams(window.location.search).get("id");
  const response1 = await fetch(`http://localhost:3000/users/${curUserId}`);
  const userData = await response1.json();
  let project = userData.Projects[curProjectId]
  document.getElementById("project-desc").innerHTML = project.description;
}
document.getElementById("signOut").addEventListener("click", signOut);
function signOut() {
  window.location.href = "login.html";
}

//Edit not implemented yet
// async function EditTask()
// {
//     const curUserId = new URLSearchParams(window.location.search).get('id');
//     const response1 = await fetch(`http://localhost:3000/users/${curUserId}`)
//     const userData = await response1.json()
//     let ProjectId = 1 //Get it somehow
//     let taskId = 1 //Get it somehow
//     let editedProperty = "taskTitle"
//     let editedTask = {
//             editedProperty : "testt", //from dom
//     }
//     userData.Projects[id].tasks.push(newTask)
//     // console.log(userData.Projects[id].tasks)
//     let edit = {
//         Projects: userData.Projects
//     }
//     fetch(`http://localhost:3000/users/${curUserId}`, {
//         method : 'PATCH',
//         headers: {
//             "Content-Type": "application/json",
//           },
//         body : JSON.stringify(edit)
//     })
// }

// Rasha's work:

// async function getData() {
//     try{
//         console.log("a");
//         const proj = await fetch("http://localhost:3000/users/1");
//         const data = await proj.json();
//         const put = document.getElementById('cont');
//         let y="";
//         data.Projects.forEach(element => {
//      y+=`<div>
//      <h1>${element.title}</h1>
//      <p>${element.description}</p>
//      <p>${element.content}</p>
//      <p>${element.create_date}</p>`
//      console.log("hh")
//     });
//     put.innerHTML=y
//     }
//     catch (error){
//         console.error(error)
//     }
// }

// async function gettaskes() {
//     try{
//         const userID = 1; //edit later
//         const ProjectID = 1; //edit later
//         const task = await fetch(`http://localhost:3000/users/${userID}`);
//         const datataske = await task.json();
//         const putdom = document.getElementById('taske');
//         let x="";
//         datataske.Projects[ProjectID].tasks.forEach(taskeselement => {
//      x+=`<div>
//      <h1>${taskeselement.taskTitle}</h1>
//      <p>${taskeselement.description}</p>
//      <p>${taskeselement.due_date}</p>
//      <p>${taskeselement.status}</p>
//      <p>${taskeselement.create_date}</p> </div>`

//     });
//     putdom.innerHTML=x
//     }
//     catch (error){
//         console.error(error)
//     }
// }
