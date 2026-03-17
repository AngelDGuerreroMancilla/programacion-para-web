

const btnCargar = document.getElementById("btnCargar");
const selectUsers = document.getElementById("menu");
const postDiv = document.getElementById("posts");
const menu = document.getElementById("menu");


btnCargar.addEventListener("click", () => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(usuarios => {
            let opciones = `<option value="">Selecciona un usuario...</option>`;
            usuarios.forEach(usr => {
                opciones += `<option value="${usr.id}">${usr.username}</option>`;
            });
            selectUsers.innerHTML = opciones;
        })
        .catch(error => {
            console.error("Hubo un error al cargar los usuarios:", error);
        });
}); 
        
menu.addEventListener("change",()=>{
    fetch(`https://jsonplaceholder.typicode.com/users/${menu.value}/posts`)
    .then(response => response.json())
        .then(listPost =>{
            
            let card = ``
            listPost.forEach(post => {
                card += ` 
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">titulo: ${post.title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">numero de publicacion: ${post.id}</h6>
                        <p class="card-text">${post.body}</p>
                        
                        <button type="button" id="btn${post.id}" onclick="coment(${post.id})" class="btn btn-primary">comentarios</button>
                        
                        <button type="button" onclick="formComment(${post.id})" class="btn btn-primary">agregar comentarios</button>
                        <div id="form${post.id}"></div>
                        <div id="${post.id}">

                        </div>
                    </div>
                </div>
            `
            })

            postDiv.innerHTML= card;
        })
        .catch(error => {
            console.error("Hubo un error al cargar los posts:", error);
        });
       
});
    

function coment(postId){
    let boton = document.getElementById(`btn${postId}`);

    if(boton.textContent == "comentarios"){
        verComments(postId);
        boton.textContent = "ocultar comentarios";
    }else{
        hideComments(postId);
        boton.textContent = "comentarios";
    }
}

function verComments(postId){

    console.log(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response=> response.json())
    .then(comments =>{
            
        let commentCard=""
            comments.forEach(comment => {
                commentCard+=`
                <div class="card" style="width: 18rem;">
                    <div class="card-header">
                        ${comment.email}
                     </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">${comment.name}</li>
                            <li class="list-group-item">${comment.body}</li>
                            
                        </ul>
                </div>
                `
                    
            });
            document.getElementById(postId).innerHTML=commentCard;
           
        })
    document.getElementById(postId).style.display="block"
}
function hideComments(postId){
    document.getElementById(postId).style.display="none";
}

function postComments(postId){
    let name= document.getElementById(`name${postId}`).value
    let email= document.getElementById(`email${postId}`).value
    let body= document.getElementById(`body${postId}`).value
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            postId: `${postId} `,
            name:`${name} `,
            email:`${email} `,
            body:`${body} `
        })
    })
    .then(response=> response.json())
    .then(data=> {
        console.log("cometario :", data )
    })
}
function formComment(postId){
    let divForm= "";
    divForm += `
        <input id="name${postId}" class="form-control form-control-lg" type="text" placeholder="nombre" aria-label=".form-control-lg example">
        <input id="email${postId}" eclass="form-control" type="email" placeholder="email" aria-label="default input example">
        <input id="body${postId}" class="form-control form-control-sm" type="text" placeholder="comentario" aria-label=".form-control-sm example">
        <button onclick="postComments(${postId})">publicar comentario</button>`

 
    document.getElementById(`form${postId}`).innerHTML=divForm
    verComments(postId);
}
  
window.verComments= verComments
window.hideComments=hideComments
window.postComments= postComments
window.formComment=formComment
window.coment=coment