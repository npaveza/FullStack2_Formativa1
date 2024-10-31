// Función para registrar usuarios
document.getElementById('registroForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario hasta validar

    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const usuario = document.getElementById('usuario').value.trim().toLowerCase(); // Convertir a minúsculas
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const direccion = document.getElementById('direccion').value.trim();

    // Validaciones
    if (!nombre || !usuario || !email || !password || !confirmPassword || !fechaNacimiento) {
        displayMessage('Todos los campos son obligatorios, excepto la dirección de despacho.', 'registerMessage');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Ingrese un correo electrónico válido.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener entre 6 y 18 caracteres, incluir al menos un número y una letra mayúscula.');
        return;
    }

    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }

    if (edad < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
    }

    // Guardar en localStorage (con usuario en minúsculas)
    const usuarioData = {
        nombre: nombre,
        usuario: usuario,
        email: email,
        password: password, // Mejor usar un hash en producción
        fechaNacimiento: fechaNacimiento.toISOString(),
    };

    // Depuración
    console.log("Registrando usuario:", usuarioData);

    localStorage.setItem(usuario, JSON.stringify(usuarioData));

    alert('Registro exitoso.');
    window.location.href = 'login.html'; // Redirigir al login después del registro
});

// Función para iniciar sesión y guardar sesión en localStorage
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario hasta validar

    const usuario = document.getElementById('loginUsuario').value.trim().toLowerCase(); // Convertir a minúsculas
    const password = document.getElementById('loginPassword').value;

    // Depuración
    console.log("Buscando usuario:", usuario);

    const usuarioData = JSON.parse(localStorage.getItem(usuario));

    if (!usuarioData) {
        console.log("Usuario no encontrado en localStorage.");
        alert('El usuario no existe.');
        return;
    }

    if (usuarioData.password !== password) {
        alert('La contraseña es incorrecta.');
        return;
    }

    // Guardar la sesión del usuario en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioData));

    alert('Inicio de sesión exitoso.');
    window.location.href = 'index.html'; // Redirigir a la página de inicio
});

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo'); // Eliminar el usuario activo del localStorage
    alert('Has cerrado sesión.');
    window.location.href = 'login.html'; // Redirigir al login después de cerrar sesión
}

// Verificar si hay una sesión activa en todas las páginas excepto login y registro
function verificarSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const pathname = window.location.pathname;

    // Evitar verificación en login.html, registro.html e index.html
    if (pathname.includes('login.html') || pathname.includes('registro.html')|| pathname.includes('index.html')) {
        return;
    }

    // Si no hay usuario activo, redirigir al login
    if (!usuarioActivo) {
        window.location.href = 'login.html';
    }
}

// Ejecutar la verificación de sesión cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
});
