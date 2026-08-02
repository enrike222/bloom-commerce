console.log("productsadmin cargado");


const productForm = document.getElementById("productForm");

let currentProductId = null;


// ===============================
// CREAR / EDITAR PRODUCTO
// ===============================

productForm.addEventListener("submit", async function(e) {

    e.preventDefault();


    const imageFile = document.getElementById("productImage").files[0];

    let imageUrl = null;



    if(imageFile){

        const fileName = Date.now() + "-" + imageFile.name;


        const { error: uploadError } = await supabaseClient
            .storage
            .from("productos")
            .upload(fileName, imageFile);



        if(uploadError){

            console.error(
                "Error subiendo imagen:",
                uploadError
            );

            alert("Error subiendo imagen");

            return;

        }



        const { data:urlData } =
        supabaseClient
        .storage
        .from("productos")
        .getPublicUrl(fileName);



        imageUrl = urlData.publicUrl;

    }



    const product = {

        nombre:
        document.getElementById("productName").value,


        precio:
        Number(document.getElementById("productPrice").value),


        categoria:
        document.getElementById("productCategory").value,


        descripcion:
        document.getElementById("productDescription").value,


        estado:
        document.getElementById("productStatus").value

    };



    if(imageUrl){

        product.imagen = imageUrl;

    }



    let result;



    if(currentProductId){


        result = await supabaseClient

        .from("productos")

        .update(product)

        .eq("id", currentProductId);



    }else{


        result = await supabaseClient

        .from("productos")

        .insert([product]);


    }





    if(result.error){

        console.error(
            "Error guardando producto:",
            result.error
        );

        alert("No se pudo guardar el producto");

        return;

    }




    if(currentProductId){

        alert("Producto actualizado correctamente");

    }else{

        alert("Producto creado correctamente");

    }




    currentProductId = null;


    productForm.reset();


    resetEditMode();


    loadProducts();


});





// ===============================
// CARGAR PRODUCTOS
// ===============================

async function loadProducts(){


    const { data, error } = await supabaseClient

    .from("productos")

    .select("*")

    .order("created_at", {
        ascending:false
    });



    if(error){

        console.error(
            "Error cargando productos:",
            error
        );

        return;

    }



    const container =
    document.getElementById("productsContainer");



    container.innerHTML = "";



    data.forEach(product => {


        const card =
        document.createElement("div");



        card.className="product-card";



        card.innerHTML = `

        <img 
        src="${product.imagen || '../assets/img/logo.svg'}"
        alt="${product.nombre}"
        >


        <h3>
        ${product.nombre}
        </h3>


        <p>
        Categoría: ${product.categoria}
        </p>


        <p>
        Precio: Q${product.precio}
        </p>


        <p>
        Estado: ${product.estado}
        </p>



        <button onclick="editProduct('${product.id}')">

        Editar

        </button>



        <button onclick="deleteProduct('${product.id}')">

        Eliminar

        </button>


        `;



        container.appendChild(card);


    });


}





// ===============================
// EDITAR PRODUCTO
// ===============================

async function editProduct(id){



    const { data, error } =
    await supabaseClient

    .from("productos")

    .select("*")

    .eq("id", id)

    .single();




    if(error){

        console.error(error);

        return;

    }



    document.getElementById("productName").value =
    data.nombre;



    document.getElementById("productPrice").value =
    data.precio;



    document.getElementById("productCategory").value =
    data.categoria;



    document.getElementById("productDescription").value =
    data.descripcion;



    document.getElementById("productStatus").value =
    data.estado;



    currentProductId = id;



    document.getElementById("saveProductBtn").textContent =
    "Actualizar producto";



    document.getElementById("cancelEditBtn").style.display =
    "inline-block";



    const message =
    document.getElementById("editModeMessage");


    if(message){

        message.style.display="block";

        message.textContent =
        "✏️ Editando producto";

    }



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


}





// ===============================
// ELIMINAR PRODUCTO
// ===============================

async function deleteProduct(id){



    const confirmDelete =
    confirm("¿Seguro que quieres eliminar este producto?");



    if(!confirmDelete) return;



    const { error } =
    await supabaseClient

    .from("productos")

    .delete()

    .eq("id", id);




    if(error){

        console.error(error);

        alert("No se pudo eliminar");

        return;

    }



    alert("Producto eliminado");


    loadProducts();


}





// ===============================
// CANCELAR EDICIÓN
// ===============================

document
.getElementById("cancelEditBtn")
.addEventListener("click", function(){


    currentProductId = null;


    productForm.reset();


    resetEditMode();


});





function resetEditMode(){


    document.getElementById("saveProductBtn").textContent =
    "Guardar producto";



    document.getElementById("cancelEditBtn").style.display =
    "none";



    const message =
    document.getElementById("editModeMessage");


    if(message){

        message.style.display="none";

    }


}





loadProducts();