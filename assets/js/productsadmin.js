/* ==========================================================
   BLOOM ADMIN
   productsadmin.js
   Versión Profesional
========================================================== */

import { supabase } from "./supabase.js";

/* ==========================================================
   VARIABLES
========================================================== */

const tableBody = document.querySelector("#productsTableBody");

const productForm = document.querySelector("#productForm");

const saveButton = document.querySelector("#saveProduct");

const cancelButton = document.querySelector("#cancelEdit");

const searchInput = document.querySelector("#searchProduct");

const categoryFilter = document.querySelector("#filterCategory");

const imageInput = document.querySelector("#productImage");

const previewImage = document.querySelector("#previewImage");

const loader = document.querySelector("#loader");

const modal = document.querySelector("#productModal");

let editingId = null;

let products = [];

let categories = [];

/* ==========================================================
   INICIALIZACIÓN
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    initializeEvents();

    await loadCategories();

    await loadProducts();

});

/* ==========================================================
   EVENTOS
========================================================== */

function initializeEvents(){

    if(productForm){

        productForm.addEventListener("submit", saveProduct);

    }

    if(cancelButton){

        cancelButton.addEventListener("click", cancelEdit);

    }

    if(searchInput){

        searchInput.addEventListener("input", filterProducts);

    }

    if(categoryFilter){

        categoryFilter.addEventListener("change", filterProducts);

    }

    if(imageInput){

        imageInput.addEventListener("change", previewSelectedImage);

    }

}

/* ==========================================================
   LOADER
========================================================== */

function showLoader(){

    if(loader){

        loader.classList.remove("hidden");

    }

}

function hideLoader(){

    if(loader){

        loader.classList.add("hidden");

    }

}

/* ==========================================================
   NOTIFICACIONES
========================================================== */

function notify(message,type="success"){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },50);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },400);

    },3000);

}

/* ==========================================================
   VISTA PREVIA
========================================================== */

function previewSelectedImage(){

    const file=imageInput.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=e=>{

        previewImage.src=e.target.result;

    }

    reader.readAsDataURL(file);

}

/* ==========================================================
   CATEGORÍAS
========================================================== */

async function loadCategories(){

    const {data,error}=await supabase

        .from("categorias")

        .select("*")

        .order("nombre");

    if(error){

        console.error(error);

        return;

    }

    categories=data;

    if(!categoryFilter) return;

    categoryFilter.innerHTML=

        `<option value="">Todas</option>`;

    data.forEach(category=>{

        categoryFilter.innerHTML+=`

            <option value="${category.nombre}">

                ${category.nombre}

            </option>

        `;

    });

}
/* ==========================================================
   CARGAR PRODUCTOS
========================================================== */

async function loadProducts() {

    showLoader();

    const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

    hideLoader();

    if (error) {
        console.error(error);
        notify("Error al cargar productos", "error");
        return;
    }

    products = data || [];

    renderProducts(products);

}

/* ==========================================================
   RENDERIZAR PRODUCTOS
========================================================== */

function renderProducts(list) {

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No hay productos registrados.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(product => {

        tableBody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${product.imagen || "../assets/img/no-image.png"}"
                    class="table-image"
                    alt="${product.nombre}"
                >

            </td>

            <td>${product.nombre}</td>

            <td>${product.categoria || "-"}</td>

            <td>Q ${Number(product.precio).toFixed(2)}</td>

            <td>

                <span class="status ${product.estado === "Activo" ? "active" : "inactive"}">

                    ${product.estado}

                </span>

            </td>

            <td>

                ${product.stock ?? 0}

            </td>

            <td>

                <button
                    class="btn-edit"
                    onclick="editProduct('${product.id}')">

                    Editar

                </button>

                <button
                    class="btn-delete"
                    onclick="deleteProduct('${product.id}')">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}

/* ==========================================================
   FILTROS
========================================================== */

function filterProducts() {

    let filtered = [...products];

    const text = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const category = categoryFilter
        ? categoryFilter.value
        : "";

    if (text !== "") {

        filtered = filtered.filter(product =>

            product.nombre.toLowerCase().includes(text) ||

            (product.descripcion || "")
                .toLowerCase()
                .includes(text)

        );

    }

    if (category !== "") {

        filtered = filtered.filter(product =>

            product.categoria === category

        );

    }

    renderProducts(filtered);

}

/* ==========================================================
   EDITAR
========================================================== */

window.editProduct = function(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    editingId = id;

    document.querySelector("#productName").value = product.nombre || "";

    document.querySelector("#productDescription").value = product.descripcion || "";

    document.querySelector("#productPrice").value = product.precio || "";

    document.querySelector("#productStock").value = product.stock || "";

    document.querySelector("#productCategory").value = product.categoria || "";

    document.querySelector("#productStatus").value = product.estado || "Activo";

    if (previewImage) {

        previewImage.src = product.imagen || "";

    }

    if (saveButton) {

        saveButton.textContent = "Actualizar Producto";

    }

    if (cancelButton) {

        cancelButton.classList.remove("hidden");

    }

    if (modal) {

        modal.scrollIntoView({
            behavior: "smooth"
        });

    }

}

/* ==========================================================
   CANCELAR EDICIÓN
========================================================== */

function cancelEdit() {

    editingId = null;

    if (productForm) {

        productForm.reset();

    }

    if (previewImage) {

        previewImage.src = "";

    }

    if (saveButton) {

        saveButton.textContent = "Guardar Producto";

    }

    if (cancelButton) {

        cancelButton.classList.add("hidden");

    }

}
/* ==========================================================
   GUARDAR / ACTUALIZAR PRODUCTO
========================================================== */

async function saveProduct(e){

    e.preventDefault();


    const name = document.querySelector("#productName").value.trim();

    const description = document.querySelector("#productDescription").value.trim();

    const price = document.querySelector("#productPrice").value;

    const stock = document.querySelector("#productStock").value;

    const category = document.querySelector("#productCategory").value;

    const status = document.querySelector("#productStatus").value;


    if(!name || !price){

        notify("Completa los campos obligatorios","error");

        return;

    }


    showLoader();


    let imageUrl = null;


    const imageFile = imageInput?.files[0];


    if(imageFile){

        imageUrl = await uploadImage(imageFile);

    }


    const productData = {

        nombre:name,

        descripcion:description,

        precio:Number(price),

        stock:Number(stock || 0),

        categoria:category,

        estado:status

    };


    if(imageUrl){

        productData.imagen = imageUrl;

    }


    let response;


    if(editingId){


        response = await supabase

            .from("productos")

            .update(productData)

            .eq("id",editingId);


    }else{


        response = await supabase

            .from("productos")

            .insert([productData]);


    }


    hideLoader();


    if(response.error){

        console.error(response.error);

        notify("No se pudo guardar el producto","error");

        return;

    }


    notify(

        editingId

        ? "Producto actualizado correctamente"

        : "Producto creado correctamente"

    );


    cancelEdit();


    await loadProducts();


}



/* ==========================================================
   SUBIR IMAGEN A STORAGE
========================================================== */


async function uploadImage(file){


    try{


        const fileExt = file.name.split(".").pop();


        const fileName =

            `${crypto.randomUUID()}.${fileExt}`;



        const filePath = `productos/${fileName}`;



        const {error} = await supabase.storage

            .from("productos")

            .upload(filePath,file);



        if(error){

            console.error(error);

            notify("Error subiendo imagen","error");

            return null;

        }



        const {data} = supabase.storage

            .from("productos")

            .getPublicUrl(filePath);



        return data.publicUrl;



    }catch(error){


        console.error(error);

        return null;


    }


}



/* ==========================================================
   ELIMINAR PRODUCTO
========================================================== */


window.deleteProduct = async function(id){


    const confirmDelete = confirm(

        "¿Seguro que deseas eliminar este producto?"

    );


    if(!confirmDelete) return;



    showLoader();



    const {error} = await supabase

        .from("productos")

        .delete()

        .eq("id",id);



    hideLoader();



    if(error){


        console.error(error);

        notify("No se pudo eliminar","error");

        return;


    }



    notify("Producto eliminado correctamente");



    await loadProducts();


}



/* ==========================================================
   LIMPIAR FORMULARIO AL CERRAR
========================================================== */


window.openProductModal = function(){


    editingId=null;


    if(productForm){

        productForm.reset();

    }


    if(previewImage){

        previewImage.src="";

    }


    if(saveButton){

        saveButton.textContent="Guardar Producto";

    }


    if(modal){

        modal.classList.add("active");

    }


}



window.closeProductModal=function(){


    if(modal){

        modal.classList.remove("active");

    }


    cancelEdit();


}



/* ==========================================================
   EXPORTAR
========================================================== */

export {

    loadProducts,

    renderProducts

};