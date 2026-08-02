console.log("Bloom components cargado");


async function loadComponent(id, file){

    const element = document.getElementById(id);

    if(!element) return;


    const response = await fetch(file);

    const html = await response.text();


    element.innerHTML = html;

}


// Cargar componentes

loadComponent(
    "sidebar-container",
    "../components/sidebar.html"
);