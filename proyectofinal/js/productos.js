//carga los productos desde el backend y los muestra en la tienda, si el token no es valido, lo manda al login

async function cargarProductos() {
    const token = localStorage.getItem('token');
    
    try {
        const respuesta = await fetch(`${apiUrl}/productos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
            const productos = await respuesta.json();
            renderizarProductos(productos);
        } else if (respuesta.status === 401) {
            mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            localStorage.removeItem('token');
            mostrarVista(vistaLogin);
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}


//rederiza los productos en la tienda, cada producto tiene un boton para agregar al carrito, que llama a la funcion agregarAlCarrito 
function renderizarProductos(productos) {
    const contenedorAbarrotes = document.getElementById('abarrotes');
    contenedorAbarrotes.innerHTML = ''; 
    contenedorAbarrotes.className = 'productos d-flex flex-wrap justify-content-center gap-3 p-3';

    productos.forEach(producto => {
        const cardHTML = `
            <div class="card" style="width: 16rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <img src="${producto.imagen}" class="card-img-top p-2" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">
              
              <div class="card-body d-flex flex-column border-top">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text text-muted small" style="flex-grow: 1;">${producto.descripcion}</p>
              </div>
              
              <ul class="list-group list-group-flush">
                <li class="list-group-item fs-5 fw-bold text-success text-center">$${producto.precio}</li>
              </ul>
              
              <div class="card-body text-center">
                <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                  Agregar al Carrito
                </button>
              </div>
            </div>
        `;
        contenedorAbarrotes.innerHTML += cardHTML;
    });
}

// boton de busqueda
formBusqueda.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const termino = inputBusqueda.value.trim();
    const token = localStorage.getItem('token');
    //verifica que el usuario tenga un token, si no lo tiene, lo manda al login
    if (!token) {
        mostrarNotificacion("Debes iniciar sesión para buscar productos.");
        mostrarVista(vistaLogin);
        return;
    }
    
    // si el termino de búsqueda está vacío, carga todos los productos
    if (termino === '') {
        cargarProductos();
        mostrarVista(vistaTienda);
        return;
    }


    //busca en la bd
    try {
        const respuesta = await fetch(`${apiUrl}/productos/buscar?q=${termino}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
            const productosEncontrados = await respuesta.json();
            mostrarVista(vistaTienda);
            
            if (productosEncontrados.length > 0) {
                renderizarProductos(productosEncontrados);
            } else {
                const contenedor = document.getElementById('abarrotes');
                contenedor.innerHTML = `<h3 class="text-center w-100 mt-5">No se encontraron productos para "${termino}" </h3>`;
            }
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});