//registro
const formRegister = document.getElementById('form-register');
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    //verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
        mostrarNotificacion('Las contraseñas no coinciden.');
        return;
    }

    // registra al usuario
    try {
        const respuesta = await fetch(`${apiUrl}/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

      
        const data = await respuesta.json();

        // Si el registro es exitoso, muestra la vista de login
        if (respuesta.ok) {
            mostrarVista(vistaLogin);
            formRegister.reset();
        } else {
            mostrarNotificacion(`Error: ${data.mensaje}`);
        }
    } catch (error) {
        console.error("Error en el registro:", error);
    }
});


//login y generacion de token
const formLogin = document.getElementById('form-login');
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // compara si la contraseña es correcta y si el usuario existe
    try {
        const respuesta = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await respuesta.json();

        //si la respuesta es ok, guarda el token en el localStorage y muestra la vista de tienda
        if (respuesta.ok) {
            localStorage.setItem('token', data.token);
            mostrarNotificacion('Inicio de sesión exitoso.');
            formLogin.reset();
            mostrarVista(vistaTienda);
            cargarProductos();
        } else {
            mostrarNotificacion(`Error: ${data.mensaje}`);
        }
    } catch (error) {
        console.error("Error en el login:", error);
    }
});

// logout elimina el token y muestra la vista de login
navLogout.addEventListener('click', (e) => {
    e.preventDefault();
    
        localStorage.removeItem('token');
        carrito = [];
        mostrarVista(vistaLogin);
    
});