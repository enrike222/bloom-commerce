/* ==========================================================
   BLOOM ADMIN
   productsadmin.js
   Productos con tarjetas
========================================================== */

import { supabase } from "./supabase.js";


/* ==========================
   ELEMENTOS
========================== */

const productsContainer =
document.querySelector("#productsContainer");

const productForm =
document.querySelector("#productForm");

const productName =
document.querySelector("#productName");

const productPrice =
document.querySelector("#productPrice");

const productCategory =
document.querySelector("#productCategory");

const productDescription =
document.querySelector("#productDescription");

const productImage =
document.querySelector("#productImage");

const imagePreview =
document.querySelector("#imagePreview");

const productStatus =
document.querySelector("#productStatus");

const saveButton =
document.querySelector("#saveProductBtn");

const cancelButton =
document.querySelector("#cancelEditBtn");

const searchInput =
document.querySelector("#searchProduct");

const filterCategory =
document.querySelector("#filterCategory");

const counter =
document.querySelector("#productsCounter");


let products = [];

let editingId = null;



/* ==========================
   INICIO
========================== */

document.addEventListener(
"DOMContentLoaded",
async()=>{


console.log(
"Bloom Products Admin iniciado"
);


events();


await loadCategories();

await loadProducts();


});



/* ==========================
   EVENTOS
========================== */

function events(){

    

productForm?.addEventListener(
"submit",
saveProduct
);



cancelButton?.addEventListener(
"click",
cancelEdit
);



searchInput?.addEventListener(
"input",
filterProducts
);



filterCategory?.addEventListener(
"change",
filterProducts
);



productImage?.addEventListener(
"change",
previewFile
);



}



/* ==========================
   CATEGORIAS
========================== */


async function loadCategories(){

const {data,error}=await supabase

.from("categorias")

.select("*")

.order("nombre");


if(error){

console.error(
"Error categorías:",
error
);

return;

}



if(productCategory){

productCategory.innerHTML=
`
<option value="">
Selecciona categoría
</option>
`;


data.forEach(cat=>{

productCategory.innerHTML+=`

<option value="${cat.id}">
${cat.nombre}
</option>

`;

});


}



if(filterCategory){

filterCategory.innerHTML=
`
<option value="">
Todas las categorías
</option>
`;


data.forEach(cat=>{

filterCategory.innerHTML+=`

<option value="${cat.id}">
${cat.nombre}
</option>

`;

});


}


}



function fillCategories(select,data,first){


if(!select) return;



select.innerHTML=

`
<option value="">
${first}
</option>
`;



data.forEach(cat=>{


select.innerHTML+=`

<option value="${cat}">
${cat}
</option>

`;

});


}





/* ==========================
   CARGAR PRODUCTOS
========================== */


async function loadProducts(){




const {data,error}=await supabase

.from("productos")

.select(`
    *,
    categorias (
        id,
        nombre
    )
`)

.order(
"created_at",
{
ascending:false
}
);


console.log(
"PRODUCTOS:",
data
);



console.log(
"ERROR:",
error
);



if(error){

alert(error.message);

return;

}










products=data || [];



renderProducts(products);



}






/* ==========================
   TARJETAS
========================== */


function renderProducts(list){


if(!productsContainer)
return;



productsContainer.innerHTML="";



if(counter){

counter.textContent=
`${list.length} productos`;

}



if(list.length===0){


productsContainer.innerHTML=

`
<p>
No hay productos registrados.
</p>
`;

return;


}





list.forEach(product=>{


productsContainer.innerHTML+=`


<article class="product-card">


<img

src="${
product.imagen ||
"../assets/img/no-image.png"
}"

alt="${product.nombre}"

>



<div class="product-info">


<h3>
${product.nombre}
</h3>



<p>
${product.descripcion || ""}
</p>



<strong>
Q ${Number(product.precio).toFixed(2)}
</strong>



<span class="status">

${product.estado}

</span>







<div class="card-actions">




<button
onclick="editProduct('${product.id}')">

Editar

</button>



<button
onclick="deleteProduct('${product.id}')">

Eliminar

</button>

</div>

</div>

</article>

`;

});

}

/* ==========================
   BUSCAR
========================== */


function filterProducts(){


let result=[...products];



const text =
searchInput?.value
.toLowerCase()
.trim();


const category =
filterCategory?.value;


if(text){

result=result.filter(p=>

p.nombre
.toLowerCase()
.includes(text)

);



}



if(category){


result=result.filter(p=>

p.categoria===category

);


}



renderProducts(result);


}




/* ==========================
   PREVIEW IMAGEN
========================== */


function previewFile(){


const file=
productImage.files[0];



if(!file)
return;



const reader=
new FileReader();



reader.onload=e=>{


imagePreview.innerHTML=

`
<img src="${e.target.result}">
`;



};



reader.readAsDataURL(file);


}




/* ==========================
   EDITAR
========================== */


window.editProduct=function(id){


const product =
products.find(
p=>p.id===id
);

if(!product)
return;

editingId=id;

productName.value =
product.nombre || "";

productPrice.value =
product.precio || "";

productCategory.value =
product.categoria?.nombre || "Sin categoría";

productDescription.value =
product.descripcion || "";

productStatus.value =
product.estado || "disponible";

saveButton.textContent =
"Actualizar producto";

cancelButton.style.display =
"block";

}


/* ==========================
   CANCELAR
========================== */


function cancelEdit(){


editingId=null;



productForm.reset();


imagePreview.innerHTML="";


saveButton.textContent =
"Guardar producto";


cancelButton.style.display =
"none";


}





/* ==========================
   GUARDAR
========================== */



async function saveProduct(e){


e.preventDefault();



const data={


nombre:
productName.value.trim(),


precio:
Number(productPrice.value),


categoria_id:
productCategory.value,


descripcion:
productDescription.value,


estado:
productStatus.value



};



if(productImage.files[0]){


const url =
await uploadImage(
productImage.files[0]
);



if(url)
data.imagen=url;


}





let result;



if(editingId){


result =
await supabase

.from("productos")

.update(data)

.eq(
"id",
editingId
);



}else{


result =
await supabase

.from("productos")

.insert([
data
]);


}





if(result.error){


console.error(result.error);

alert(result.error.message);

return;

}






alert(
editingId
?
"Producto actualizado"
:
"Producto creado"
);



cancelEdit();



await loadCategories();

await loadProducts();


}





/* ==========================
   STORAGE
========================== */


async function uploadImage(file){


const ext =
file.name.split(".").pop();



const name =
`${crypto.randomUUID()}.${ext}`;



const path =
`productos/${name}`;



const {error}=await supabase.storage

.from("productos")

.upload(
path,
file
);



if(error){

console.error(error);

return null;

}



const {data}=supabase.storage

.from("productos")

.getPublicUrl(path);



return data.publicUrl;


}




/* ==========================
   ELIMINAR
========================== */


window.deleteProduct=async function(id){


if(!confirm(
"¿Eliminar producto?"
))
return;



const {error}=await supabase

.from("productos")

.delete()

.eq(
"id",
id
);



if(error){

alert(error.message);

return;

}







await loadProducts();





};