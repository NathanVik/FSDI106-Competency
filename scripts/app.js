iconToggle = false;
var serverUrl = "https://fsdiapi.azurewebsites.net/";
let tasks = [];

function checkOther() {
    let category = $(`#selCategory`).val();
    if (category === "5") {
        $(`#otherCategory`).show();
    } else {
        $(`#otherCategory`).hide();
    }
}

function toggleForm() {

    if ($(`#inputForm`).is(":hidden")) {
        $(`#inputForm`).show();
    } else {
        $(`#inputForm`).hide();
    }

}

function toggleImportant() {
    if (iconToggle) {
        $(`#icon-important`).removeClass(`fa-exclamation`).addClass(`fa-times`);
        iconToggle = false;
    } else {
        $(`#icon-important`).removeClass(`fa-times`).addClass(`fa-exclamation`);
        iconToggle = true;
    }
}
function clearInputs(){
    $(`#txtTitle`).val("");
    $(`#txtDescription`).val("");
    $(`#selDuedate`).val("");
    $(`#selCategory`).val("");
    $(`#otherCategory`).val("");
    $(`#txtLocation`).val("");
    $(`#selColor`).val("");
    iconToggle = true;
    toggleImportant();
}

function saveTask() {

    let title = $(`#txtTitle`).val();
    let description = $(`#txtDescription`).val();
    let duedate = $(`#selDuedate`).val();
    let category = $(`#selCategory`).val();
    if (category == "5") category = $(`#otherCategory`).val();
    let location = $(`#txtLocation`).val();
    let color = $(`#selColor`).val();

    let task = new Task(title, iconToggle, description, duedate, category, location, color);
    console.log(task);

    $.ajax({
        type: `POST`,
        url: serverUrl + "api/tasks/",
        data: JSON.stringify(task),
        contentType: `application/JSON`,

        success: function (response) {
            console.log(`Server says ${response}`)
            // process good, display
            let newTask = JSON.parse(response);
            displayTask(newTask);
            clearInputs();
        },

        error: function (error) {
            console.log(`Server failed, ${error}`)
            //show there was an error

        }
    });

}

function fetchTasks() {
    //create a get request for same url as post
    //
    $.ajax({
        type: `GET`,
        url: serverUrl + "api/tasks",
        success: function (response) {
            tasks = JSON.parse(response);
            //filter tasks by name
            for (var i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                if (task.name == "NathanV") {
                    displayTask(task);
                }
            }
        },
        error: function (err) {
            console.log(`error getting data, ${err}`);
        }
    });
}


function displayTask(newtask) {
    //create syntax
    if (newtask.isImportant) {
        var taskIcon = `<i class="fa-exclamation fas" style="color:red"></i>`
    } else {
        var taskIcon = `<i class="fa-times fas" style="color:grey"></i>`
    }
    let syntax = `

    <div class="task-box" style="background-color:${newtask.color}" id="${newtask._id}">

    <div class="task-leftside">
        <div id="iconBox">${taskIcon}</div>
        <div class="left-text"><h3>${newtask.title}</h3>${newtask.description}</div>
    </div>

    <div class="task-rightside">
        <div class="task-info">
            <p>Category: ${newtask.category}<br>Due Date: ${newtask.duedate}<br>Location: ${newtask.location}</p>
        </div>
        <div class="deleteBox">
            <button class="btn btn-dark" onclick="markDone('${newtask._id}')">Done</button>
        </div>
    </div>
</div>


    `;
    //append syntax to container
    if (newtask.status == `Done`) {
        $(`#doneTasks`).append(syntax);
    } else {
        $(`#pendingTasks`).append(syntax);
    }

}

function markDone(id) {
    console.log("clicked the done button", id);
    //remove from screen
    $(`#${id}`).remove();

    for (i = 0; i < tasks.length; i++) { //get object from tasks via the id
        let item = tasks[i];
        if (item._id == id) {
            item.status = "Done";
            $.ajax({ //create a PUT request
                type: `PUT`,
                url: serverUrl + "api/tasks",
                data: JSON.stringify(item),
                contentType: `application/JSON`,
                success: function (res) {
                    console.log(`put results ${res}`);
                    let updatedTask = JSON.parse(res);
                    displayTask(updatedTask);
                },
                error: function (err) {
                    console.log(`Error updating, ${err}`);
                }
            });
        }
    }





}

function init() {

    console.log(`Loaded JS`);

    fetchTasks();

    $(`#selCategory`).change(checkOther);
    $(`#btn-toggle`).click(toggleForm);
    $(`#icon-important`).click(toggleImportant);
    $(`#btn-saveTask`).click(saveTask);


    $(`#otherCategory`).hide();
}

window.onload = init;



function testRequest() {
    $.ajax({
        type: `GET`,
        url: `https://restclass.azurewebsites.net/api/test`,
        success: function (response) {
            console.log(`Response Succeeded, ${response}`);
        },
        error: function (errorDetails) {
            console.log(`Error on sending request, ${errorDetails}`);
        }
    })

}