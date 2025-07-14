document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-productos');
  const inputBusqueda = document.getElementById('busqueda');
  const selectCategoria = document.getElementById('categoria');
  let productos = [];

  fetch('productos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos(productos);
    });

  function mostrarProductos(items) {
    lista.innerHTML = '';
    if (items.length === 0) {
      lista.innerHTML = '<p>No se encontraron productos 🥺</p>';
      return;
    }
    items.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('card-producto');
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio.toLocaleString()} COP</p>
        <p>${prod.descripcion}</p>
        <a href="${prod.wpp}" class="btn-wpp" target="_blank">Pedir por WhatsApp</a>
      `;
      lista.appendChild(card);
    });
  }

  function filtrar() {
    const texto = inputBusqueda.value.toLowerCase();
    const categoria = selectCategoria.value;

    const filtrados = productos.filter(p =>
      (p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)) &&
      (categoria === '' || p.categoria === categoria)
    );
    mostrarProductos(filtrados);
  }

  inputBusqueda.addEventListener('input', filtrar);
  selectCategoria.addEventListener('change', filtrar);
});
