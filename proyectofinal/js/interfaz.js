const apiUrl = 'http://localhost:3000/api';

const vistaLogin = document.getElementById('sect-login');
const vistaRegistro = document.getElementById('sect-register');
const vistaTienda = document.querySelector('.tienda');
const vistaCarrito = document.querySelector('.carrito');
const vistaPedidos = document.getElementById('vista-pedidos');
const contenedorListaPedidos = document.getElementById('contenedor-lista-pedidos');
const navInicio = document.getElementById('nav-inicio');
const navCarrito = document.getElementById('nav-carrito');
const navCuenta = document.getElementById('nav-cuenta');
const navLogout = document.getElementById('nav-logout');
const formBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');

//inicializamos el carro como array vacio
let carrito = [];


function mostrarNotificacion(mensaje) {

    const alerta = document.createElement('div');
    alerta.className = `alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
    alerta.style.zIndex = '1050'; 
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alerta);
    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => alerta.remove(), 150);
    }, 3000);
}


function ocultarTodasLasVistas() {
    vistaLogin.style.display = 'none';
    vistaRegistro.style.display = 'none';
    vistaTienda.style.display = 'none';
    vistaCarrito.style.display = 'none';
    vistaPedidos.style.display = 'none';
}

function mostrarVista(vista) {
    ocultarTodasLasVistas();
    vista.style.display = 'block'; 
}

// revisa si el usuario tiene un token al cargar la página, y muestra la vista correspondiente
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (token) {
        mostrarVista(vistaTienda);
        cargarProductos(); 
    } else {
        mostrarVista(vistaLogin);
    }
});

// Eventos del nav, si el usuario no tiene token, lo redirige al login
navInicio.addEventListener('click', (e) => {
    e.preventDefault();
    if(localStorage.getItem('token')) {
        mostrarVista(vistaTienda);
    } else {
        mostrarVista(vistaLogin);
    }
});

//si tiene token muesta el carrito, sino lo manda al login
navCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    if(localStorage.getItem('token')) {
        renderizarCarrito();
        mostrarVista(vistaCarrito);
    } else {
        mostrarNotificacion("Debes iniciar sesión para ver tu carrito.");
        mostrarVista(vistaLogin);
    }
});

//si tiene token muesta los pedidos, sino lo manda al login
navCuenta.addEventListener('click', (e) => {
    e.preventDefault();
    if(localStorage.getItem('token')) {
        cargarMisPedidos();
        mostrarVista(vistaPedidos);
    } else {
        mostrarNotificacion("Debes iniciar sesión para ver tus pedidos.");
        mostrarVista(vistaLogin);
    }
});

// Cambiar entre Login y Registro
document.querySelector('#sect-login .btn-link').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarVista(vistaRegistro);
});

document.querySelector('#sect-register .btn-link').addEventListener('click', (e) => {
    e.preventDefault();
    mostrarVista(vistaLogin);
});