let datos = [];

// Función para iniciar la búsqueda de alumnos
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
    .then(respuesta => {
      
      datos = respuesta.data;
      document.getElementById("resultado").textContent = `Alumnos Encontrados: ${respuesta.data.length}`;
      mostrarAlumnos();
      mostrarFrecuencias();
      mostrarEstadisticas();
    })
    .catch(error => {
      const myModal = new bootstrap.Modal(document.getElementById('myModal'));
      document.getElementById("modalBody").innerHTML = `<p>${error.message}</p>`;
      myModal.show();
      document.getElementById("resultado").textContent = `Hubo un error obteniendo los resultados`;
    });
}

// Función para mostrar los alumnos en una tabla
function mostrarAlumnos() {
  // Obtiene la tabla de alumnos por su id y selecciona el cuerpo de la tabla
  let tabla = document.getElementById("miTabla").getElementsByTagName('tbody')[0];
  tabla.innerHTML = ''; // Limpia cualquier contenido previo de la tabla

  // Itera sobre los datos de los alumnos
  datos.forEach(element => {
    // Crea una nueva fila en la tabla
    let nuevaFila = tabla.insertRow();
    // Inserta celdas en la fila para cada atributo del alumno
    let celda1 = nuevaFila.insertCell(0);
    let celda2 = nuevaFila.insertCell(1);
    let celda3 = nuevaFila.insertCell(2);
    let celda4 = nuevaFila.insertCell(3);
    let celda5 = nuevaFila.insertCell(4);

    // Agrega clases CSS a la primera celda (opcional)
    celda1.classList.add('table-secondary');
    // Inserta los datos del alumno en las celdas correspondientes
    celda1.innerHTML = element.nombre;
    celda2.innerHTML = element.apellido;
    celda3.innerHTML = element.Edad; // Asegúrate que 'Edad' coincida con el nombre exacto del campo en tus datos
    celda4.innerHTML = element.curso;
    celda5.innerHTML = element.nivel;
  });
}

// Función para mostrar las frecuencias de variables (nivel y curso)
function mostrarFrecuencias() {
  // Muestra las frecuencias para la variable 'nivel'
  mostrarFrecuencia('nivel', 'tablaFrecuenciaNivel');
  // Muestra las frecuencias para la variable 'curso'
  mostrarFrecuencia('curso', 'tablaFrecuenciaCurso');
}

// Función para mostrar la frecuencia de una variable específica en una tabla
function mostrarFrecuencia(variable, tablaId) {
  // Calcula las frecuencias de la variable especificada
  let frecuencia = calcularFrecuencia(datos, variable);
  // Obtiene la tabla correspondiente por su id y selecciona el cuerpo de la tabla
  let tabla = document.getElementById(tablaId).getElementsByTagName('tbody')[0];
  tabla.innerHTML = ''; // Limpia cualquier contenido previo de la tabla

  // Itera sobre los datos de frecuencia calculados
  frecuencia.forEach(item => {
    // Crea una nueva fila en la tabla
    let nuevaFila = tabla.insertRow();
    // Inserta celdas en la fila para cada atributo de frecuencia
    let celda1 = nuevaFila.insertCell(0);
    let celda2 = nuevaFila.insertCell(1);
    let celda3 = nuevaFila.insertCell(2);
    let celda4 = nuevaFila.insertCell(3);

    // Inserta los datos de frecuencia en las celdas correspondientes
    celda1.innerHTML = item.valor;
    celda2.innerHTML = item.absoluta;
    celda3.innerHTML = item.acumulada;
    celda4.innerHTML = item.relativa.toFixed(2) + '%'; // Formatea la frecuencia relativa a 2 decimales
  });
}

// Función para calcular las frecuencias de una variable específica en los datos de los alumnos
function calcularFrecuencia(datos, variable) {
  let frecuencia = []; // Array para almacenar los datos de frecuencia
  let valoresUnicos = []; // Array para almacenar los valores únicos de la variable

  // Itera sobre los datos de los alumnos
  for (let i = 0; i < datos.length; i++) {
    let valor = datos[i][variable]; // Obtiene el valor de la variable para cada alumno
    // Si el valor no está en el array de valores únicos, lo agrega
    if (!valoresUnicos.includes(valor)) {
      valoresUnicos.push(valor);
    }
  }

  // Itera sobre los valores únicos para crear objetos de frecuencia inicializados
  for (let i = 0; i < valoresUnicos.length; i++) {
    frecuencia.push({ valor: valoresUnicos[i], absoluta: 0, acumulada: 0, relativa: 0 });
  }

  // Itera sobre los datos de los alumnos para contar las frecuencias
  for (let i = 0; i < datos.length; i++) {
    let valor = datos[i][variable]; // Obtiene el valor de la variable para cada alumno
    // Itera sobre el array de frecuencia para incrementar las frecuencias correspondientes
    for (let j = 0; j < frecuencia.length; j++) {
      if (frecuencia[j].valor === valor) {
        frecuencia[j].absoluta++; // Incrementa la frecuencia absoluta
        break;
      }
    }
  }

  // Calcula la frecuencia acumulada y relativa para cada objeto de frecuencia
  let total = datos.length;
  let acumulada = 0;
  for (let i = 0; i < frecuencia.length; i++) {
    acumulada += frecuencia[i].absoluta;
    frecuencia[i].acumulada = acumulada; // Asigna la frecuencia acumulada
    frecuencia[i].relativa = (frecuencia[i].absoluta / total) * 100; // Calcula la frecuencia relativa
  }

  return frecuencia; // Devuelve el array de objetos de frecuencia
}

// Función para calcular la media de una variable específica en los datos de los alumnos
function calcularMedia(datos, variable) {
  let suma = 0; // Variable para almacenar la suma de los valores de la variable
  // Itera sobre los datos de los alumnos para sumar los valores de la variable
  for (let i = 0; i < datos.length; i++) {
    suma += datos[i][variable]; // Suma el valor de la variable para cada alumno
  }
  return suma / datos.length; // Calcula y devuelve la media
}

// Función para calcular la mediana de una variable específica en los datos de los alumnos
function calcularMediana(datos, variable) {
  let edades = []; // Array para almacenar los valores de la variable
  // Itera sobre los datos de los alumnos para obtener los valores de la variable
  for (let i = 0; i < datos.length; i++) {
    edades.push(datos[i][variable]); // Añade el valor de la variable al array de edades
  }
  edades.sort((a, b) => a - b); // Ordena los valores de forma ascendente
  let middle = Math.floor(edades.length / 2); // Calcula el índice medio del array
  // Verifica si la longitud del array es par o impar para calcular la mediana
  if (edades.length % 2 === 0) {
    return (edades[middle - 1] + edades[middle]) / 2; // Mediana para longitud par
  } else {
    return edades[middle]; // Mediana para longitud impar
  }
}

// Función para calcular el valor máximo de una variable específica en los datos de los alumnos
function calcularMaximo(datos, variable) {
  let maximo = datos[0][variable]; // Inicializa el valor máximo con el primer valor de la variable
  // Itera sobre los datos de los alumnos para encontrar el valor máximo de la variable
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][variable] > maximo) {
      maximo = datos[i][variable]; // Actualiza el valor máximo si se encuentra uno mayor
    }
  }
  return maximo; // Devuelve el valor máximo encontrado
}

// Función para calcular el valor mínimo de una variable específica en los datos de los alumnos
function calcularMinimo(datos, variable) {
  let minimo = datos[0][variable]; // Inicializa el valor mínimo con el primer valor de la variable
  // Itera sobre los datos de los alumnos para encontrar el valor mínimo de la variable
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][variable] < minimo) {
      minimo = datos[i][variable]; // Actualiza el valor mínimo si se encuentra uno menor
    }
  }
  return minimo; // Devuelve el valor mínimo encontrado
}

// Función para calcular el cuartil específico de una variable en los datos de los alumnos
function calcularCuartil(datos, variable, cuartil) {
  let valores = []; // Array para almacenar los valores de la variable
  // Itera sobre los datos de los alumnos para obtener los valores de la variable
  for (let i = 0; i < datos.length; i++) {
    valores.push(datos[i][variable]); // Añade el valor de la variable al array de valores
  }

  // Ordena los valores de forma ascendente 
  valores = valores.slice().sort((a, b) => a - b);

  // Calcula la posición del cuartil deseado en el array ordenado
  let posicion = cuartil * (valores.length - 1);
  let base = Math.floor(posicion);
  let resto = posicion - base;

  let cuartilCalculado;
  if (resto === 0) {
    cuartilCalculado = valores[base];
  } else {
    cuartilCalculado = valores[base] + resto * (valores[base + 1] - valores[base]);
  }

  return cuartilCalculado; // Devuelve el cuartil calculado
}

// Función para calcular el desvío estándar de una variable en los datos de los alumnos
function calcularDesvioEstandar(datos, variable) {
  let media = calcularMedia(datos, variable); // Calcula la media de la variable
  let sumaCuadrados = 0; // Variable para almacenar la suma de los cuadrados de las diferencias

  // Itera sobre los datos de los alumnos para calcular la suma de los cuadrados de las diferencias
  for (let i = 0; i < datos.length; i++) {
    sumaCuadrados += Math.pow(datos[i][variable] - media, 2); // Suma el cuadrado de la diferencia respecto a la media
  }

  return Math.sqrt(sumaCuadrados / datos.length); // Calcula y devuelve el desvío estándar
}

function mostrarEstadisticas() {
  let media = calcularMedia(datos, 'Edad');
  let mediana = calcularMediana(datos, 'Edad');
  let maximo = calcularMaximo(datos, 'Edad');
  let minimo = calcularMinimo(datos, 'Edad');
  let primerCuartil = calcularCuartil(datos, 'Edad', 0.25);
  let segundoCuartil = calcularCuartil(datos, 'Edad', 0.5);
  let desvioEstandar = calcularDesvioEstandar(datos, 'Edad');

  // Obtiene la tabla de estadísticas por su id y selecciona el cuerpo de la tabla
  let tabla = document.getElementById('miTablaEst').getElementsByTagName('tbody')[0];
  tabla.innerHTML = ''; // Limpia cualquier contenido previo de la tabla

  // Crea una nueva fila en la tabla
  let nuevaFila = tabla.insertRow();
  // Inserta celdas en la fila para cada estadística calculada
  let celda1 = nuevaFila.insertCell(0);
  let celda2 = nuevaFila.insertCell(1);
  let celda3 = nuevaFila.insertCell(2);
  let celda4 = nuevaFila.insertCell(3);
  let celda5 = nuevaFila.insertCell(4);
  let celda6 = nuevaFila.insertCell(5);
  let celda7 = nuevaFila.insertCell(6);

  // Inserta los valores de las estadísticas en las celdas correspondientes
  celda1.innerHTML = media.toFixed(2); // Media con 2 decimales
  celda2.innerHTML = mediana.toFixed(2); // Mediana con 2 decimales
  celda3.innerHTML = maximo; // Valor máximo
  celda4.innerHTML = minimo; // Valor mínimo
  celda5.innerHTML = primerCuartil.toFixed(2); // Primer cuartil con 2 decimales
  celda6.innerHTML = segundoCuartil.toFixed(2); // Segundo cuartil con 2 decimales
  celda7.innerHTML = desvioEstandar.toFixed(2); // Desvío estándar con 2 decimales
}

