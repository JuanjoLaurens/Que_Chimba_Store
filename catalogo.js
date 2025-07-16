document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-productos');
  const destacados = document.querySelector('.grid-destacados');
  const inputBusqueda = document.getElementById('busqueda');
  const selectCategoria = document.getElementById('categoria');
  const modal = document.getElementById('modal-producto');
  const cerrarModal = modal?.querySelector('.cerrar-modal');
  const carousel = document.getElementById('carousel');
  const modalNombre = document.getElementById('modal-nombre');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalPrecio = document.getElementById('modal-precio');
  const modalTallas = document.getElementById('modal-tallas');
  const modalColores = document.getElementById('modal-colores');
  const modalVariantes = document.getElementById('modal-variantes');
  const modalWpp = document.getElementById('modal-wpp');

  let productos = [];

  fetch('productos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      if (lista) mostrarProductos(productos);
      if (destacados) mostrarDestacados(productos);
    })
    .catch(err => {
      if (lista) lista.innerHTML = '<p>Error cargando productos 😢</p>';
      console.error('Error:', err);
    });

  function mostrarProductos(items) {
    lista.innerHTML = '';
    if (items.length === 0) {
      lista.innerHTML = '<p>No se encontraron productos 🥺</p>';
      return;
    }

    items.forEach(prod => {
      const card = crearCardProducto(prod);
      lista.appendChild(card);
    });
  }

  function mostrarDestacados(items) {
    const top = [...items]
      .sort((a, b) => b.precio - a.precio)
      .slice(0, 4);

    destacados.innerHTML = '';
    top.forEach(prod => {
      const card = crearCardProducto(prod, true); // true = versión para index
      destacados.appendChild(card);
    });
  }

  function crearCardProducto(prod, esIndex = false) {
    const card = document.createElement('div');
    card.classList.add('card-producto');
    card.innerHTML = `
      <img src="${prod.imagenes?.[0] || 'img/placeholder.png'}" alt="${prod.nombre}" />
      <div class="info-producto">
        <h3>${prod.nombre}</h3>
        <p class="precio">$${prod.precio.toLocaleString()} DOP</p>
        <a href="${prod.wpp}" target="_blank" class="btn-wpp">Consultar por WhatsApp</a>
      </div>
    `;

    if (!esIndex) {
      card.addEventListener('click', e => {
        if (!e.target.classList.contains('btn-wpp')) {
          abrirModal(prod);
        }
      });
    }

    return card;
  }

  if (inputBusqueda && selectCategoria) {
    inputBusqueda.addEventListener('input', filtrar);
    selectCategoria.addEventListener('change', filtrar);
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

  function abrirModal(producto) {
    modalNombre.textContent = producto.nombre;
    modalDescripcion.textContent = producto.descripcion;
    modalPrecio.textContent = `$${producto.precio.toLocaleString()} DOP`;
    modalWpp.href = producto.wpp;
    modalTallas.textContent = producto.tallas ? `Tallas: ${producto.tallas.join(', ')}` : '';
    modalColores.textContent = producto.colores ? `Colores: ${producto.colores.join(', ')}` : '';
    modalVariantes.textContent = producto.variantes ? `Diseños: ${producto.variantes.join(', ')}` : '';

    const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : ['img/placeholder.png'];
    carousel.innerHTML = '';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'carousel-img-container';

    imagenes.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = producto.nombre;
      if (index === 0) img.classList.add('active');
      imgContainer.appendChild(img);
    });

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-buttons';

    imagenes.forEach((_, index) => {
      const dot = document.createElement('button');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => updateSlide(index));
      dotsContainer.appendChild(dot);
    });

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.className = 'carousel-arrow prev';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.className = 'carousel-arrow next';

    let current = 0;

    const updateSlide = (index) => {
      const imgs = imgContainer.querySelectorAll('img');
      const dots = dotsContainer.querySelectorAll('button');
      imgs.forEach((img, i) => {
        img.classList.toggle('active', i === index);
        dots[i].classList.toggle('active', i === index);
      });
      current = index;
    };

    prevBtn.addEventListener('click', () => {
      current = (current - 1 + imagenes.length) % imagenes.length;
      updateSlide(current);
    });

    nextBtn.addEventListener('click', () => {
      current = (current + 1) % imagenes.length;
      updateSlide(current);
    });

    carousel.appendChild(imgContainer);
    if (imagenes.length > 1) {
      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);
      carousel.appendChild(dotsContainer);
    }

    modal.classList.remove('hidden');
  }

  cerrarModal?.addEventListener('click', () => modal.classList.add('hidden'));
  window.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});
