console.log("productsadmin actualizado cargado");


const productForm = document.getElementById("productForm");

let currentProductId = null;



// ===============================
// CARGAR CATEGORÍAS
// ===============================

async function loadCategories(){


    const { data, error } = await supabaseClient
    .from("categorias")
    .select("id,nombre")
    .order("nombre");


    if(error){

        console.error(
            "Error cargando categorías:",
            error
        );

        return;

    }



    const select =
    document.getElementById("productCategory");



    select.innerHTML = `

    <option value="">
    Selecciona categoría
    </option>

    `;



    data.forEach(category => {


        select.innerHTML += `

        <option value="${category.id}">
        ${category.nombre}
        </option>

        `;


    });


}






// ===============================
// CREAR / EDITAR PRODUCTO
// ===============================

productForm.addEventListener(
"submit",
async function(e){


e.preventDefault();



const imageFile =
document.getElementById("productImage").files[0];



let imageUrl = null;





// SUBIR IMAGEN

if(imageFile){



    if(imageFile.size > 5000000){

        alert(
        "La imagen debe pesar menos de 5MB"
        );

        return;

    }





    const fileName =
    Date.now() +
    "-" +
    imageFile.name.replace(/\s/g,"-");





    const { error: uploadError } =
    await supabaseClient
    .storage
    .from("bloom-products")
    .upload(
        fileName,
        imageFile
    );





    if(uploadError){

        console.error(uploadError);

        alert(
        "Error subiendo imagen"
        );

        return;

    }





    const { data:urlData } =
    supabaseClient
    .storage
    .from("bloom-products")
    .getPublicUrl(
        fileName
    );



    imageUrl =
    urlData.publicUrl;



}





const product = {


    nombre:
    document.getElementById("productName").value,



    precio:
    Number(
    document.getElementById("productPrice").value
    ),



    categoria_id:
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



    result =
    await supabaseClient

    .from("productos")

    .update(product)

    .eq(
        "id",
        currentProductId
    );



}else{



    result =
    await supabaseClient

    .from("productos")

    .insert([product]);



}







if(result.error){


    console.error(
        result.error
    );


    alert(
    "Error guardando producto"
    );


    return;


}







alert(

currentProductId ?

"Producto actualizado correctamente"

:

"Producto creado correctamente"

);







currentProductId = null;


productForm.reset();


resetEditMode();


loadProducts();



});









// ===============================
// CARGAR PRODUCTOS
// ===============================


async function loadProducts(){



const { data, error } =

await supabaseClient

.from("productos")

.select(`

*,

categorias(
nombre
)

`)

.order(
"created_at",
{
ascending:false
}

);





if(error){

console.error(error);

return;

}






const container =
document.getElementById(
"productsContainer"
);




container.innerHTML = "";







data.forEach(product => {



container.innerHTML += `


<div class="product-card">



<img

src="${product.imagen || '../assets/img/logo.svg'}"

alt="${product.nombre}"

>




<h3>

${product.nombre}

</h3>




<p>

🌸 ${product.categorias?.nombre || "Sin categoría"}

</p>




<p>

Q${product.precio}

</p>




<p>

${product.estado}

</p>




<button onclick="editProduct('${product.id}')">

✏️ Editar

</button>




<button onclick="deleteProduct('${product.id}')">

🗑️ Eliminar

</button>




</div>



`;



});



}









// ===============================
// EDITAR PRODUCTO
// ===============================


async function editProduct(id){



const { data,error } =

await supabaseClient

.from("productos")

.select("*")

.eq(
"id",
id
)

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
data.categoria_id;



document.getElementById("productDescription").value =
data.descripcion;



document.getElementById("productStatus").value =
data.estado;





currentProductId = id;





document.getElementById(
"saveProductBtn"
).textContent =
"Actualizar producto";





document.getElementById(
"cancelEditBtn"
).style.display =
"inline-block";





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
confirm(
"¿Eliminar producto?"
);



if(!confirmDelete)
return;





const { error } =

await supabaseClient

.from("productos")

.delete()

.eq(
"id",
id
);






if(error){


console.error(error);


alert(
"No se pudo eliminar"
);


return;


}






alert(
"Producto eliminado"
);



loadProducts();



}









// ===============================
// CANCELAR EDICIÓN
// ===============================


const cancelButton =
document.getElementById(
"cancelEditBtn"
);



if(cancelButton){


cancelButton.addEventListener(
"click",
()=>{


currentProductId=null;


productForm.reset();


resetEditMode();



});



}







function resetEditMode(){



document.getElementById(
"saveProductBtn"
).textContent =
"Guardar producto";





document.getElementById(
"cancelEditBtn"
).style.display =
"none";



}









// ===============================
// PREVIEW IMAGEN
// ===============================


const imageInput =
document.getElementById(
"productImage"
);



const imagePreview =
document.getElementById(
"imagePreview"
);




if(imageInput && imagePreview){



imageInput.addEventListener(
"change",
function(){



const file =
this.files[0];




if(!file){


imagePreview.innerHTML="";


return;


}




const url =
URL.createObjectURL(file);




imagePreview.innerHTML = `


<img

src="${url}"

alt="Vista previa"

>


`;



});



}







loadCategories();

loadProducts();