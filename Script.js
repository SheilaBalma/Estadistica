// Esta función retorna una promesa que busca los datos de los alumnos.
function buscarAlumnos() {
    return new Promise((resolver, rechazar) => {
        // Muestra un mensaje mientras se busca la información.
        document.getElementById("resultado").textContent = `Estamos buscando los alumnos"`;

        // Utiliza fetch para hacer una petición HTTP a la API.
        fetch('https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1')
            .then(response => {
                if (!response.ok) {
                    // Si la respuesta no es OK, devuelve un error y se rechaza la promesa.
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(datos => {
                // Si la promesa se resuelve, devuelve lo obtenido
                resolver(datos);
            })
            .catch(error => {
                // Si hay un error, rechaza la promesa, y devuelve el error
                rechazar(error);
            });
    });
}

function pedirBuscarAlumnos() {
    buscarAlumnos()
        .then((respuesta) => {
            // Si la promesa se resuelve, obtiene lo devuelto por esta y lo almacena en datos.
            datos = respuesta.data;
            //actalizamos el mensaje
            document.getElementById("resultado").textContent = `Alumnos Encontrados: ${respuesta.data.length}`;
            
            //se llama a las siguiente dos funciones para mostrar los alumnos
            mostrarAlumnos(); //Para mostrar los datos
            alumnosPrimaria(); //Para contabilizar los de primaria
        })
        .catch((error) => {
            // Si la promesa se rechaza, muestra el error en un modal de Boostrap.
            const myModal = new bootstrap.Modal(document.getElementById('myModal')); // lo obtenemos por ID
            document.getElementById("modalBody").innerHTML = '<p>' + error.message + '</p>'; //insertamos en su etiqueta <p></p> el error
            myModal.show(); //mostramos el modal
             //actalizamos el mensaje
             document.getElementById("resultado").textContent = `Hubo un error obteniendo los resultados`;
            
        });
    }

function mostrarAlumnos() {
    // Muestro en Tabla de Poblacion

    if (datos.length > 0) { //si la longitud de los datos obtenidos es mayor a 0 (los datos son un arreglo)
        let tabla = document.getElementById("miTabla").getElementsByTagName('tbody')[0]; //obtenemos la tabla por ID
        datos.forEach((element, index) => { //le insertamos las celdas y columnas con los datos
            let nuevaFila = tabla.insertRow();
            let celda1 = nuevaFila.insertCell(0);
            let celda2 = nuevaFila.insertCell(1);
            let celda3 = nuevaFila.insertCell(2);
            let celda4 = nuevaFila.insertCell(3);
            let celda5 = nuevaFila.insertCell(4);


            celda1.classList.add('table-secondary'); // se le agrega una clase de boostrap a la primer celda
            celda1.innerHTML = element.nombre;
            celda2.innerHTML = element.apellido;
            celda3.innerHTML = element.Edad;
            celda4.innerHTML = element.curso;
            celda5.innerHTML = element.nivel;
        });
    }

    // Muestra en Frecuencia

    //Muestra en Estadistico
}