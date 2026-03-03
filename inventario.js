
class Prod {
    constructor(id, nombre, categoria, cantidad, costo) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.cantidad = cantidad;
        this.costo = costo;
    }
}
class Inventario {
    constructor() {
        this.prod = new Map();
    }

    agregar(prod) {
        if (this.prod.has(prod.id)) {
        
            throw new Error("id usado");
        }
        if (prod.cantidad <= 0 || prod.costo <= 0) {
            
            throw new Error("La cantidad y costo deben ser mayores a 0");
        }
        
        this.prod.set(prod.id, prod);
        console.log("Inventario actualizado:", this.prod);
        return true;
    }
}

const inv = new Inventario();
const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const cant = parseInt(document.getElementById('cantidad').value);
    const costo = parseFloat(document.getElementById('costo').value);
    const nuevoProd = new Prod(id, nombre, categoria, cant, costo);
    
    try {
        inv.agregar(nuevoProd);
        showNotification("¡Producto agregado con éxito!", "success");
        form.reset();
    } catch (error) {
        showNotification(error.message, "error");
    }
});
function showNotification(message, type) {
    const container = document.getElementById('notificacion');
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${type}`;
    notificacion.innerText = message;

    container.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}