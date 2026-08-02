console.log("Bloom components cargado");



async function loadComponent(id, file){


    const element = document.getElementById(id);


    if(!element) return;



    const response = await fetch(file);


    const html = await response.text();



    element.innerHTML = html;



    setActiveSidebar();



}





function setActiveSidebar(){



    const currentPage = window.location.pathname
    .split("/")
    .pop();



    const links = document.querySelectorAll(
        ".sidebar-menu a"
    );



    links.forEach(link => {



        const linkPage = link
        .getAttribute("href");



        if(linkPage === currentPage){


            link.classList.add("active");


        }else{


            link.classList.remove("active");


        }



    });



}





loadComponent(
    "sidebar-container",
    "../components/sidebar.html"
);