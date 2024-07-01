async function createProject()
{
    const curUserId = new URLSearchParams(window.location.search).get('id');
    const response1 = await fetch(`http://localhost:3000/users/${curUserId}`)
    const userData = await response1.json()
    let newProjectId = 0;
    if(userData.Projects.length == 0) newProjectId = 0;
    else {
        newProjectId = userData.Projects[userData.Projects.length - 1].id + 1
    }

    let newPorject = {
        id : newProjectId,
        title: "Test-title",   //Change to dom controllers
        description: "testsdfgsdgdfdesc", //Change to dom controllers
        content: "test-content", //Change to dom controllers
        create_date:  new Date().toLocaleDateString(),
        tasks: []
      }
      userData.Projects.push(newPorject)
    const response = await fetch(`http://localhost:3000/users/${curUserId}`, {
        method : 'PATCH',
        headers: {
            "Content-Type": "application/json",
          },
        body : JSON.stringify(userData)
    })
}
async function createTask(project_id)
{
    const curUserId = new URLSearchParams(window.location.search).get('id');
    const response1 = await fetch(`http://localhost:3000/users/${curUserId}`)
    const userData = await response1.json()
    let ProjectID = project_id
    let newTask = {
            id: userData.Projects[ProjectID].tasks.length,
            taskTitle: "testt",
            description: "testd",
            due_date: "test22",
            status: "testok",
            content: "testcont",
            history: [{
                status: "To-do",
                date : new Date().toLocaleDateString()
            }]
    }
    userData.Projects[ProjectID].tasks.push(newTask)
    // console.log(userData.Projects[id].tasks)
    let edit = {
        Projects: userData.Projects
    }
    await fetch(`http://localhost:3000/users/${curUserId}`, {
        method : 'PATCH',
        headers: {
            "Content-Type": "application/json",
          },
        body : JSON.stringify(edit)       
    })
}

async function EditTask(project_id, task_id, selected_property, new_value)
{
    const curUserId = new URLSearchParams(window.location.search).get('id');
    const response1 = await fetch(`http://localhost:3000/users/${curUserId}`)
    const userData = await response1.json()
    let ProjectId = project_id //Get it somehow
    let taskId = task_id //Get it somehow
    let editedProperty = selected_property //the property to be edited
    let newEdit = new_value  // the new value for the edited property
    userData.Projects[ProjectId].tasks[taskId][editedProperty] = newEdit
    fetch(`http://localhost:3000/users/${curUserId}`, {
        method : 'PATCH',
        headers: { "Content-Type": "application/json",},
        body : JSON.stringify(userData)       
    })
}

async function EditProject(project_id, edited_property, edited_value)
{
    const curUserId = new URLSearchParams(window.location.search).get('id');
    const response1 = await fetch(`http://localhost:3000/users/${curUserId}`)
    const userData = await response1.json()
    let ProjectId = project_id //Get it somehow
    let editedProperty = edited_property //what property to edit
    let newEdit = edited_value  // the new value for the edited property
    userData.Projects[ProjectId][editedProperty] = newEdit;
    fetch(`http://localhost:3000/users/${curUserId}`, {
        method : 'PATCH',
        headers: {
            "Content-Type": "application/json",
          },
        body : JSON.stringify(userData)       
    })
}

async function deletproject(project_id){
    const userid = new URLSearchParams(window.location.search).get('id');
    const getlastdata = await fetch(`http://localhost:3000/users/${userid}`)
    const returntojson = await getlastdata.json();
    const ProjectID = project_id //getfrom dom
    returntojson.Projects =  returntojson.Projects.filter(cutproject=>cutproject.id !== ProjectID )
    returntojson.Projects.forEach((element, index) => {
        element.id = index;
    });
    await fetch(`http://localhost:3000/users/${userid}`, {
        method : 'PATCH',
        headers: {
            "Content-Type": "application/json",
          },
        body : JSON.stringify(returntojson) 
    })
}

async function deleteTask(task_id, project_id){
    const userid = new URLSearchParams(location.search).get('id');
    const getlastdata = await fetch(`http://localhost:3000/users/${userid}`)
    const returntojson = await getlastdata.json();
    const ProjectID = project_id //getfrom dom 
    const taskesindex = task_id //get from dom
    returntojson.Projects[ProjectID].tasks =  returntojson.Projects[ProjectID].tasks.filter(cuttaskes=>cuttaskes.id !== taskesindex)
    returntojson.Projects[ProjectID].tasks.forEach((element, index) => {
        element.id = index;
    });
   await fetch(`http://localhost:3000/users/${userid}`,{
    method:'PATCH',
    headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(returntojson)

   })
}


async function wipeUserProjects()
    {
        //idk if this is really needed ngl
    }

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