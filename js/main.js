// elements
const radioViewOptions = document.querySelectorAll("input[name='view-option']");
// const listView = document.getElementById("list-view");
// const boardView = document.getElementById("board-view");
const projects = document.getElementsByClassName("project-container");
const addTaskCTA = document.getElementById("add-task-cta");
const addProjectCTA = document.getElementById("add-project-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const setProjectOverlay = document.getElementById("set-project-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const statusSelect = document.getElementById("status-select");
const statusDropdown = document.getElementById("status-dropdown");
const statusDropdown2 = document.getElementById("status-dropdown-for-taskview");
const taskItems = document.querySelectorAll(".task-item");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const deleteTaskCTA = document.getElementById("delete-task-cta");
const notification = document.getElementById("notification");
const quickview = document.getElementById("project-quickview");
const taskStatusBtn = document.getElementById("status-dropdown-task-overview");

// the current active overlay
let activeOverlay = null;
let activeProject = projects[0];
//** event listeners **//
// radio buttons for view option
radioViewOptions.forEach((radioButton) => {
  radioButton.parentNode.addEventListener("mouseenter",async (e) =>
    { 
      // quickview.style.visibility = "visible"
      await setTimeout(() => {
        quickview.style.visibility = "visible"
      },1000);
      quickview.style.top = e.clientY + "px"
      quickview.style.left = e.clientX + "px"
      quickview.style.visibility = "visible"
      await setTimeout(() => {
        quickview.style.visibility = "hidden"
      },3000);

    })

  // radioButton.addEventListener("change", (event) => {
  //   const eventTarget = event.target;
  //   const viewOption = eventTarget.value;
  //   // console.log(eventTarget)
  //       document.getElementById("ulTo-do").innerHTML = "";
  //       activeProject = projects[viewOption]
  //       activeProject.classList.remove("hide");
  //       renderTasks(viewOption);
  // });
});

// add task
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  // disable scrolling for content behind the overlay
  document.body.classList.add("overflow-hidden");
});

// add project 
addProjectCTA.addEventListener("click", () => {
  setProjectOverlay.classList.remove("hide");
  activeOverlay = setProjectOverlay;
  // disable scrolling for content behind the overlay
  document.body.classList.add("overflow-hidden");
});
// close buttons inside overlays
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeOverlay.classList.add("hide");
    activeOverlay = null;
    // reenable scrolling
    document.body.classList.remove("overflow-hidden");
  });
});



// click a task
taskItems.forEach((task) => {
  task.addEventListener("click", () => {
    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    // disable scrolling for content behind the overlay
    document.body.classList.add("overflow-hidden");
  });
});

// delete a task
deleteTaskCTA.addEventListener("click", () => {
  activeOverlay.classList.add("hide");
  activeOverlay = null;
  // reenable scrolling
  document.body.classList.remove("overflow-hidden");
  // show notification & hide it after a while
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
});

//status drop down 
// taskStatusBtn.addEventListener("click", (e) =>
// {
//   statusDropdown2.classList.toggle("hide");
// })