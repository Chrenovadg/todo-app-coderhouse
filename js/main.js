var modalNuevaTarea = document.querySelector('.nuevaTarea__modal');
var inputNuevaTarea = document.querySelector('.nuevaTarea__nombre');
var contenedorTareas = document.querySelector('.lista__tareas');

// Botones
var nuevaTarea = document.querySelector('.btn__nuevaTarea');
var guardarTarea = document.querySelector('.btn__save');
var closeModal = document.querySelector('.btn__closeModal');

modalNuevaTarea.style.display = 'none';

// NUEVA TAREA 
nuevaTarea.addEventListener('click', function() {
    modalNuevaTarea.style.display = (modalNuevaTarea.style.display === "none") ? 'block' : 'none';
});

closeModal.addEventListener('click', function() {
    modalNuevaTarea.style.display = (modalNuevaTarea.style.display === "none") ? 'block' : 'none';
});

// TAREA ELEMENTOS VISUALES
function crearElementosVisualesTarea(tareaInfo, clave) {
    // Crear contenedor de tarea
    const contenedorNuevaTarea = contenedorTareas.appendChild(document.createElement("div"));
    contenedorNuevaTarea.classList.add("tarea");
    contenedorNuevaTarea.dataset.clave = clave; // Asignar la clave como atributo data

    // Crear elementos de checkbox
    const formCheck = document.createElement("div");
    formCheck.classList.add('form-check');
    const inputCheck = formCheck.appendChild(document.createElement("input"));
    inputCheck.classList.add('form-check-input');
    inputCheck.type = 'checkbox';
    inputCheck.id = 'flexCheckChecked';
    const labelCheck = formCheck.appendChild(document.createElement('label'));
    labelCheck.classList.add('form-check-label');
    labelCheck.setAttribute('for', 'flexCheckChecked');
    contenedorNuevaTarea.appendChild(formCheck);

    // Crear contenido de la tarea
    const contenidoTarea = contenedorNuevaTarea.appendChild(document.createElement('div'));
    contenidoTarea.classList.add('tarea__datos');

    // Crear título de la tarea
    const tareaTitulo = contenidoTarea.appendChild(document.createElement('span'));
    tareaTitulo.classList.add('tarea__titulo');
    tareaTitulo.textContent = tareaInfo.titulo;

    // Crear botón Editar
    var btnEdit = contenidoTarea.appendChild(document.createElement('button'));
    btnEdit.classList.add('btn__edit');
    btnEdit.textContent = 'Editar';

    // Crear botón Borrar
    var btnDelete = contenidoTarea.appendChild(document.createElement('button'));
    btnDelete.classList.add('btn__delete');
    btnDelete.textContent = 'Borrar';
    // Evento click en el botón "Borrar"
    btnDelete.addEventListener('click', function() {
        handleDeleteClick(contenedorNuevaTarea);
    }); /* uwu */
}

// Evento click en el botón "Borrar"
contenedorTareas.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn__delete')) {
        const contenedorNuevaTarea = event.target.closest('.tarea');
        if (contenedorNuevaTarea) {
            const claveTarea = contenedorNuevaTarea.dataset.clave;
            localStorage.removeItem(claveTarea);
            contenedorNuevaTarea.remove();

            // Actualizar el array tareasArray
            tareasArray = tareasArray.filter(tarea => tarea.clave !== claveTarea);

            // Actualizar elementos visuales
            actualizarElementosVisuales();
        }
    }
});

// GUARDAR TAREA
guardarTarea.addEventListener('click', function() {
    var textoIngresado = inputNuevaTarea.value;
    if (textoIngresado.trim() === "") {
        alert('Por favor ingresa un nombre ^_^');
    } else {
        if (textoIngresado.length > 0) {
            const mensaje = '¡' + textoIngresado + ' es el nuevo nombre de tu tarea (❁´◡`❁) !';
            alert(mensaje);
            inputNuevaTarea.value = '';
            modalNuevaTarea.style.display = 'none';

            var tareaInfo = {
                titulo: textoIngresado
            };

            const clave = 'tarea-' + Date.now();
            localStorage.setItem(clave, JSON.stringify(tareaInfo));
            crearElementosVisualesTarea(tareaInfo, clave);

            tareasArray.push({ clave, tareaInfo });
            actualizarElementosVisuales();
        }
    }
});

// Función para actualizar elementos visuales
function actualizarElementosVisuales() {
    contenedorTareas.innerHTML = '';

    tareasArray.sort((a, b) => b.clave.localeCompare(a.clave));

    tareasArray.forEach(tarea => {
        const { clave, tareaInfo } = tarea;
        crearElementosVisualesTarea(tareaInfo, clave);
    });
}

// Crear un array para almacenar las tareas
var tareasArray = [];

// Cargar tareas del localStorage al cargar la página
for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);

    if (clave.startsWith('tarea-')) {
        const tareaInfo = JSON.parse(localStorage.getItem(clave));
        tareasArray.push({ clave, tareaInfo });
    }
}
// Actualizar elementos visuales al cargar la página
actualizarElementosVisuales();


// Función para activar la edición de una tarea
function activarEdicion(contenedorNuevaTarea) {
    const tareaTitulo = contenedorNuevaTarea.querySelector('.tarea__titulo');
    const btnEdit = contenedorNuevaTarea.querySelector('.btn__edit');
    const btnDelete = contenedorNuevaTarea.querySelector('.btn__delete');

    // Desactivar los botones Editar y Borrar durante la edición
    btnEdit.disabled = true;
    btnDelete.disabled = true;

    const originalTitulo = tareaTitulo.textContent;

    const inputEdicion = document.createElement('input');
    inputEdicion.type = 'text';
    inputEdicion.value = originalTitulo;

    tareaTitulo.textContent = '';
    tareaTitulo.appendChild(inputEdicion);
    inputEdicion.focus();

    const btnGuardarCambios = document.createElement('button');
    btnGuardarCambios.textContent = 'Guardar Cambios';
    btnGuardarCambios.classList.add('btn__guardarCambios');

    contenedorNuevaTarea.appendChild(btnGuardarCambios);

    // Evento click en el botón "Guardar Cambios"
    btnGuardarCambios.addEventListener('click', function() {
        const nuevoTitulo = inputEdicion.value;

        if (nuevoTitulo.trim() === "") {
            alert('El título no puede estar en blanco');
        } else {
            tareaTitulo.textContent = nuevoTitulo;

            // Habilitar nuevamente los botones Editar y Borrar
            btnEdit.disabled = false;
            btnDelete.disabled = false;

            // Actualizar la información en el LocalStorage
            const claveTarea = contenedorNuevaTarea.dataset.clave;
            const tareaIndex = tareasArray.findIndex(item => item.clave === claveTarea);

            if (tareaIndex !== -1) {
                tareasArray[tareaIndex].tareaInfo.titulo = nuevoTitulo;
                localStorage.setItem(claveTarea, JSON.stringify(tareasArray[tareaIndex].tareaInfo));
            }

            // Eliminar el botón "Guardar Cambios"
            btnGuardarCambios.remove();
        }
    });
}

// Evento click en el botón "Editar"
contenedorTareas.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn__edit')) {
        const contenedorNuevaTarea = event.target.closest('.tarea');
        if (contenedorNuevaTarea) {
            activarEdicion(contenedorNuevaTarea);
        }
    }
});