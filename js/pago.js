let contadorProductos = localStorage.getItem("canProductos");
const notyf = new Notyf();

function agregarArticulos() {

    let valorCompra = document.getElementById('valorCompra');
    let iva = document.getElementById('iva');
    let totalCompra = document.getElementById('TotalCompra');
    let descuentoTotal = document.getElementById('descuentoTotal');

    if (contadorProductos > 0) {

        let sumatoriaValorCompra = 0;

        // Iterar sobre todas las claves del localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);

            // If para obtener el número del producto 
            if (clave.slice(0, 3) === "img") {
                let numeroProducto = parseInt(clave[3]);
                if (clave.length > 4) {
                    numeroProducto = parseInt(clave.slice(3, 5));
                }

                console.log(numeroProducto);

                // Crear <div> que contiene dos div img y detalles
                const containerCards = document.createElement('div');
                containerCards.className = 'container-cards';
                containerCards.id = 'container-cards' + numeroProducto;

                // Crear dos div para la imagen y los datos de los artículos
                const containerImg = document.createElement('div');
                containerImg.className = 'container-imagen';
                containerImg.id = 'container-imagen';

                // Insertar imagen
                const imgProducto = document.createElement('img');
                imgProducto.src = localStorage.getItem('img' + numeroProducto);
                containerImg.append(imgProducto);

                // Insertar botones con sus respectivas funciones
                const containerBotones = document.createElement('div');
                containerBotones.className = "containerBotones";
                const botonMas = document.createElement('button');
                botonMas.textContent = "+";
                botonMas.addEventListener('click', function() {
                    funAgregar(numeroProducto);
                });
                const botonMenos = document.createElement('button');
                botonMenos.textContent = "-";
                botonMenos.addEventListener('click', function() {
                    funEliminar(numeroProducto);
                });
                containerBotones.append(botonMas, botonMenos);
                containerImg.append(containerBotones);

                // Contenedor detalles del producto
                const containerDetalles = document.createElement('div');
                containerDetalles.className = 'container-detalles';
                containerDetalles.id = 'container-detalles';

                const name = document.createElement('p');
                name.textContent = localStorage.getItem('name' + numeroProducto);
                const referencia = document.createElement('p');
                referencia.textContent = "Referencia : " + localStorage.getItem('referencia' + numeroProducto);
                const precio = document.createElement('p');
                precio.textContent = "Precio : $ " + localStorage.getItem('precio' + numeroProducto);
                containerDetalles.append(name, referencia, precio);

                // Añadir los dos contenedores al container-cards
                containerCards.append(containerImg, containerDetalles);

                // Insertar el <div> en el contenedor padre
                document.getElementById('conatiner-articulos').appendChild(containerCards);

                // Calcular el precio total de los artículos
                sumatoriaValorCompra += (parseFloat(localStorage.getItem('precio' + numeroProducto)) * 1000);

                // Sumar los precios
                valorCompra.textContent = "Valor = $ " + sumatoriaValorCompra;
            }
        }

        iva.textContent = "IVA (19% ) = $ " + (sumatoriaValorCompra * 0.19).toFixed(2);

        // Aplicar descuento según la cantidad de productos en el carrito
        let descuento = 0;
        if (contadorProductos >= 7) {
            descuento = sumatoriaValorCompra * 0.20; // 20% de descuento
        } else if (contadorProductos >= 5) {
            descuento = sumatoriaValorCompra * 0.15; // 15% de descuento
        } else if (contadorProductos >= 3) {
            descuento = sumatoriaValorCompra * 0.10; // 10% de descuento
        }

        // Mostrar el descuento total en el HTML
        descuentoTotal.textContent = "Descuento = $ " + descuento.toFixed(2); // Aquí se muestra el descuento

        // Actualizar el total con el descuento aplicado
        const totalConDescuento = sumatoriaValorCompra - descuento;
        totalCompra.textContent = "Total = $ " + (totalConDescuento + (totalConDescuento * 0.19)).toFixed(2);

    } else {
        notyf.success("No hay productos en el carrito");
        valorCompra.textContent = "Valor = 0";
        iva.textContent = "IVA (19% ) = 0";
        totalCompra.textContent = "Total = 0";
        descuentoTotal.textContent = "Descuento = $0"; // Si no hay productos, el descuento es 0

        const containerCarroVacio = document.createElement('div');
        containerCarroVacio.id = "container-carro-vacio";
        containerCarroVacio.innerHTML = `<p> ¡Que esperas! </p>
      <p> Agrega tu articulo </p>
      <span class="icono-regalo">🎁</span>
    `;
        document.getElementById('conatiner-articulos').appendChild(containerCarroVacio);
    }
}
agregarArticulos();

function actualizar() {
    location.reload();
}

function funAgregar(ubicacion) {
    let ultimoProducto = 0;
    let numeroProducto2 = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const clave2 = localStorage.key(i);
        // Obtener el número del último producto
        if (clave2.slice(0, 3) === "img") {
            numeroProducto2 = parseInt(clave2[3]);
            if (clave2.length > 4) {
                numeroProducto2 = parseInt(clave2.slice(3, 5));
            }
        }
        if (numeroProducto2 > ultimoProducto) {
            ultimoProducto = numeroProducto2;
        }
    }

    // Índice del último producto
    ultimoProducto++;
    // Datos del artículo a clonar
    const clonName = localStorage.getItem("name" + ubicacion);
    const clonReferencia = localStorage.getItem("referencia" + ubicacion);
    const clonImg = localStorage.getItem("img" + ubicacion);
    const clonPrecio = localStorage.getItem("precio" + ubicacion);
    notyf.success("Has agregado otro articulo a tu carrito");

    // Guardar en el LS el producto adicional
    localStorage.setItem("name" + ultimoProducto, clonName);
    localStorage.setItem("referencia" + ultimoProducto, clonReferencia);
    localStorage.setItem("img" + ultimoProducto, clonImg);
    localStorage.setItem("precio" + ultimoProducto, clonPrecio);

    contadorProductos++;
    localStorage.setItem("canProductos", contadorProductos);

    // Esperar 3 segundos (3000 ms) antes de llamar a la función actualizar
    setTimeout(actualizar, 1500);
}

function funEliminar(ubicacion) {
    notyf.error("Eliminaste un articulo");
    localStorage.removeItem("img" + ubicacion);
    localStorage.removeItem("name" + ubicacion);
    localStorage.removeItem("precio" + ubicacion);
    localStorage.removeItem("referencia" + ubicacion);
    document.getElementById('container-cards' + ubicacion).remove();

    contadorProductos--;
    localStorage.setItem("canProductos", contadorProductos);

    // Esperar 3 segundos (1500 ms) antes de llamar a la función actualizar
    setTimeout(actualizar, 1500);
}