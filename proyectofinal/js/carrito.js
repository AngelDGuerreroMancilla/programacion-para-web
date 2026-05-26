// agregar para el carrito de compras y pedidos
function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(item => item.producto_id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ producto_id: id, nombre: nombre, precio_unitario: precio, cantidad: 1 });
    }
    mostrarNotificacion(`${nombre} agregado al carrito!`);
}

//renderiz el carrito
function renderizarCarrito() {
    const contenedorCarrito = document.querySelector('.carrito');
    contenedorCarrito.innerHTML = ''; 
    
    //si el array de carrito esta vacio, muestra el mensaje
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<h3 class="text-center mt-5">Tu carrito está vacío, agrega productos.</h3>';
        return;
    }

    //si el carrito tiene productos crea el contenedor vacio
    let html = `
        <div class="container mt-4">
            <h2>Mi Carrito de Compras</h2>
            <ol class="list-group list-group-numbered mt-3 mb-4">
    `;

    let cantProductos = 0;

     //crea cada item del carrito, con su subtotal y botones para modificar la cantidad
    carrito.forEach((item, index) => {
        const subtotal = item.precio_unitario * item.cantidad;
        cantProductos += subtotal;

        html += `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${item.nombre}</div>
                    Precio unitario: $${item.precio_unitario}
                </div>
                <div class="d-flex align-items-center me-3">
                    <button class="btn btn-sm btn-outline-danger me-2" onclick="modificarCantidad(${index}, -1)">-</button>
                    <span class="badge text-bg-primary rounded-pill me-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-success" onclick="modificarCantidad(${index}, 1)">+</button>
                </div>
                <span class="fw-bold text-success">$${subtotal.toFixed(2)}</span>
            </li>
        `;
    });

    // al final muestra el total y un boton para finalizar la compra, que llama a la funcion enviarPedidoAlBackend
    html += `
            </ol>
            <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded border">
                <h4 class="mb-0">Total a Pagar: <span class="text-success">$${cantProductos.toFixed(2)}</span></h4>
                <button class="btn btn-lg btn-success" onclick="enviarPedidoAlBackend(${cantProductos})">
                     Comprar
                </button>
            </div>
        </div>
    `;
    
    //inyecta el html
    contenedorCarrito.innerHTML = html;
}

//modifica la cantidad de un producto en el carrito segun si el boton vale 1 o -1, si la cantidad llega a 0, elimina el producto del carrito
function modificarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1); 
    renderizarCarrito(); 
}


//postea el pedido en la bd, antes para por el router.js
async function enviarPedidoAlBackend(totalCalculado) {
    const token = localStorage.getItem('token');
    
    try {
        const respuesta = await fetch(`${apiUrl}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ total: totalCalculado, carrito: carrito })
        });

        const data = await respuesta.json();

        //muestra mensaje y reinicia el carrito 
        if (respuesta.ok) {
            mostrarNotificacion(`Tu pedido #${data.id_pedido} ha sido procesado.`);
            carrito = []; 
            mostrarVista(vistaTienda); 
        } else {
            mostrarNotificacion(`Error al procesar el pedido: ${data.mensaje}`);
        }
    } catch (error) {
        console.error("Error al enviar pedido:", error);
    }
}

//carga pedidos de la bd
async function cargarMisPedidos() {
    const token = localStorage.getItem('token');
    contenedorListaPedidos.innerHTML = '<p>Cargando historial...</p>';
    
    try {
        const respuesta = await fetch(`${apiUrl}/mis-pedidos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
            const pedidos = await respuesta.json();
            
            if (pedidos.length === 0) {
                contenedorListaPedidos.innerHTML = '<h4>Aún no has realizado ninguna compra.</h4>';
                return;
            }

            let html = '<div class="list-group">';
            
            pedidos.reverse().forEach(pedido => {
                const fecha = new Date(pedido.fecha_pedido).toLocaleDateString();
                const detallesCarrito = typeof pedido.carrito === 'string' ? JSON.parse(pedido.carrito) : pedido.carrito;
                
                let listaArticulos = '<ul>';
                detallesCarrito.forEach(art => {
                    listaArticulos += `<li>${art.cantidad}x ${art.nombre} ($${art.precio_unitario})</li>`;
                });
                listaArticulos += '</ul>';

                html += `
                    <div class="list-group-item list-group-item-action flex-column align-items-start mb-3 border rounded">
                        <div class="d-flex w-100 justify-content-between bg-light p-2 rounded">
                            <h5 class="mb-1">Pedido #${pedido.id}</h5>
                            <small class="text-muted">Realizado el: ${fecha}</small>
                        </div>
                        <p class="mb-1 mt-2"><strong>Total pagado: <span class="text-success">$${pedido.total}</span></strong></p>
                        <p class="mb-0 text-muted small">Artículos comprados:</p>
                        ${listaArticulos}
                    </div>
                `;
            });
            
            html += '</div>';
            contenedorListaPedidos.innerHTML = html;
        }
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        contenedorListaPedidos.innerHTML = '<p>Error al cargar el historial de pedidos.</p>';
    }
}