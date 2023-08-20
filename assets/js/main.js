const todoForm = document.querySelector('.todo-form');
const todoList = document.querySelector('.todo-list');
const dialogElement = document.querySelector('dialog');
const actorsAssigneİnform = document.querySelector('.users');
const closeBtn = document.querySelector('.close');
const addTodo = document.querySelector('.add-todo');
const optionActor = document.querySelector('#actor-id');
const optionAssignee = document.querySelector('#assigne-id');



let todos = [];
let users = [];


function closeDialog(){
    dialogElement.close();
}


async function loadData(){
    todos = await fetch('https://todorestapi-20432433159e.herokuapp.com/api/todos/').then(x => x.json());
    users = await fetch('https://todorestapi-20432433159e.herokuapp.com/api/users/').then(x => x.json());
    render();
}

function render(){
    for (const user of users) {

        optionActor.innerHTML += `<option value="${user.id}">${user.username}</option>`
        optionAssignee.innerHTML += ` <option value="${user.id}">${user.username}</option>`
    }

    for (const todo of todos) {
        
        todoList.innerHTML += `
        <li class="todo-item">
            <label>
                <input class='toggle' type="checkbox">
                <span class="todo-name">${todo.title}</span>
                <button data-todoid = "${todo.id}" class="del">X</button>
                <button data-todoid = "${todo.id}" class="showMore">more</button>
            </label>
        </li>
        `
    }
    bindClick();
}

function bindClick(){
    for (const btn of document.querySelectorAll('.del')) {
        btn.addEventListener('click',delTodo)
    }
    for (const more of document.querySelectorAll('.showMore')) {
        more.addEventListener('click',openDialog)
    }
    document.querySelector('.close').addEventListener('click',closeDialog)
    
}

function openDialog(){
    dialogElement.showModal();
    findTodo(this.dataset.todoid);
    
}



async function findTodo(todoId){
    let userDetail = await fetch(`https://todorestapi-20432433159e.herokuapp.com/api/todos/${todoId}/`).then(x => x.json());
    showDetail(userDetail);
    
}

function showDetail(userDetail){
    let actors = users.find(x => x.id === userDetail.actor);
    let assignees = users.find(x => x.id === userDetail.assignee);
    
    
    actorsAssigneİnform.innerHTML = `
    <div class="users-information">
                <h4 class="actor-username"> Actor's Username: ${actors.username}</h4>
                <h4 class="actor-name">Actor's Name: ${actors.first_name} ${actors.last_name}</h4>
                <h4 class="actor-email">Actor's E-mail: ${actors.email}</h4>

                <h4 class="assignee-username">Assignee's Username: ${assignees.username}</h4>
                <h4 class="assignee-name">Assignee's Name:${assignees.first_name} ${assignees.last_name}</h4>
                <h4 class="assignee-email">Assignee's E-mail:${assignees.email}</h4>
                <button class="close">Close</button>
            </div>
    `
    bindClick();
    
}


function delTodo(todoId){

    todoId = this.dataset.todoid;
    fetch(`https://todorestapi-20432433159e.herokuapp.com/api/todos/delete/${todoId}/`,{
        method: 'DELETE',
        headers:{
            'Content-type': 'application/json;'
        }
    })
    .then(x => x.json())
}



addTodo.addEventListener('click',todoEkle)
function todoEkle(){
    let data = {
        title: document.querySelector('.todo-input').value,
        completed:false,
        actor: optionActor.value,
        assignee: optionAssignee.value
    };

    fetch('https://todorestapi-20432433159e.herokuapp.com/api/todos/create/',{
        method:"POST",
        headers:{
            'Content-type': 'application/json;'
        },
        body:JSON.stringify(data)
    })
    .then(x => x.json())
    .then(data => {
        
        todoList.innerHTML += `
        <li class="todo-item">
            <label>
                <input class='toggle' type="checkbox">
                <span class="todo-name">${data.title}</span>
                <button class="del">X</button>
                <button data-todoid = "${data.id}" class="showMore">more</button>
            </label>
        </li>
        `
       

    })
}




loadData();