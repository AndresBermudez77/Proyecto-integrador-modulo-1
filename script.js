const platos = [
  { nombre: "Risotto de Champiñones", descripcion: "Arroz cremoso con setas frescas.", precio: "$12.000", img: "https://www.google.com/imgres?q=risotto%20de%20champi%C3%B1ones&imgurl=https%3A%2F%2Fwww.daisybrand.com%2Fwp-content%2Fuploads%2F2019%2F12%2FWILD-MUSHROOM-RISOTTO-770x628.jpg&imgrefurl=https%3A%2F%2Fwww.daisybrand.com%2Fes%2Frecetas%2Frisotto-de-champinones-silvestres%2F&docid=EAbMZN9fAPMCzM&tbnid=Ef5K6EUQtZiqnM&vet=12ahUKEwi8l47szvqQAxVyVTABHclYKggQM3oECCAQAA..i&w=770&h=628&hcb=2&ved=2ahUKEwi8l47szvqQAxVyVTABHclYKggQM3oECCAQAA" },
  { nombre: "Filete de Salmón", descripcion: "Acompañado de vegetales al vapor.", precio: "$18.000", img: "https://via.placeholder.com/100" },
  { nombre: "Ensalada Mediterránea", descripcion: "Con aceitunas, queso feta y tomate.", precio: "$10.000", img: "https://via.placeholder.com/100" },
  { nombre: "Pasta Alfredo", descripcion: "Con salsa cremosa de parmesano.", precio: "$14.000", img: "https://via.placeholder.com/100" },
  { nombre: "Pizza Margarita", descripcion: "Clásica con mozzarella y albahaca.", precio: "$16.000", img: "https://via.placeholder.com/100" },
  { nombre: "Pollo a la Parrilla", descripcion: "Marinado con hierbas finas.", precio: "$15.000", img: "https://via.placeholder.com/100" },
  { nombre: "Tarta de Chocolate", descripcion: "Postre casero con cacao puro.", precio: "$8.000", img: "https://via.placeholder.com/100" },
  { nombre: "Pechuga en queso gratinado", descripcion: "Pechuga con queso gratinado.", precio: "$20.000", img: "https://via.placeholder.com/100" }
];

const menu = document.getElementById("menu");

platos.forEach(plato => {
  const div = document.createElement("div");
  div.classList.add("plato");

  div.innerHTML = `
    <img src="${plato.img}" alt="${plato.nombre}">
    <div class="info">
      <h3>${plato.nombre}</h3>
      <p>${plato.descripcion}</p>
    </div>
    <div class="precio">${plato.precio}</div>
  `;

  menu.appendChild(div);
});

