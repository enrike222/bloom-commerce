console.log("customers.js cargado");


const customerForm = document.getElementById(
    "customerForm"
);


let currentCustomerId = null;



// ==============================
// GUARDAR / ACTUALIZAR CLIENTE
// ==============================

if(customerForm){


customerForm.addEventListener(
"submit",
async function(e){


e.preventDefault();



const cliente = {


nombre:
document.getElementById(
"customerName"
).value,


email:
document.getElementById(
"customerEmail"
).value,


telefono:
document.getElementById(
"customerPhone"
).value,


direccion:
document.getElementById(
"customerAddress"
).value


};






let result;



// EDITAR

if(currentCustomerId){



result = await supabaseClient

.from("clientes")

.update(cliente)

.eq(
"id",
currentCustomerId
);



}



// CREAR

else {



result = await supabaseClient

.from("clientes")

.insert([cliente]);


}





if(result.error){


console.error(
result.error
);


alert(
"No se pudo guardar el cliente"
);


return;


}





alert(
currentCustomerId
?
"Cliente actualizado"
:
"Cliente creado"
);






customerForm.reset();



currentCustomerId = null;



document.getElementById(
"customerFormTitle"
).textContent =
"Nuevo cliente";



document.getElementById(
"saveCustomerBtn"
).textContent =
"Guardar cliente";



document.getElementById(
"cancelEditCustomer"
).style.display =
"none";



loadCustomers();



});


}







// ==============================
// CARGAR CLIENTES
// ==============================


async function loadCustomers(search=""){



let query = supabaseClient

.from("clientes")

.select("*")

.order(
"created_at",
{
ascending:false
}
);





if(search){


query = query.ilike(
"nombre",
`%${search}%`
);


}





const {data,error} =
await query;





if(error){


console.error(error);

return;


}







const table =
document.getElementById(
"customersTable"
);



if(!table)return;



table.innerHTML="";






if(data.length===0){



table.innerHTML=`

<tr>

<td colspan="5" class="empty-state">

No hay clientes.

</td>

</tr>

`;

return;


}







data.forEach(cliente=>{



const row =
document.createElement("tr");



row.innerHTML = `



<td>
${cliente.nombre}
</td>



<td>
${cliente.email}
</td>



<td>
${cliente.telefono || "-"}
</td>



<td>
${cliente.direccion || "-"}
</td>



<td>



<button onclick="editCustomer('${cliente.id}')">

✏️ Editar

</button>



<button onclick="deleteCustomer('${cliente.id}')">

🗑️ Eliminar

</button>



</td>



`;



table.appendChild(row);



});



}







// ==============================
// EDITAR CLIENTE
// ==============================


async function editCustomer(id){



const {data,error}=

await supabaseClient

.from("clientes")

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







document.getElementById(
"customerName"
).value =
data.nombre;



document.getElementById(
"customerEmail"
).value =
data.email;



document.getElementById(
"customerPhone"
).value =
data.telefono || "";



document.getElementById(
"customerAddress"
).value =
data.direccion || "";





currentCustomerId=id;



document.getElementById(
"customerFormTitle"
).textContent =
"Editar cliente";



document.getElementById(
"saveCustomerBtn"
).textContent =
"Actualizar cliente";



document.getElementById(
"cancelEditCustomer"
).style.display =
"block";



window.scrollTo({

top:0,

behavior:"smooth"

});



}







// ==============================
// ELIMINAR CLIENTE
// ==============================


async function deleteCustomer(id){



if(!confirm(
"¿Eliminar cliente?"
))
return;






const {error}=

await supabaseClient

.from("clientes")

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





loadCustomers();


}







// ==============================
// BUSCADOR
// ==============================


const searchInput =
document.getElementById(
"customerSearch"
);



if(searchInput){



searchInput.addEventListener(
"input",
function(){


loadCustomers(
this.value
);


});


}







// ==============================
// CANCELAR EDICIÓN
// ==============================


const cancelBtn =
document.getElementById(
"cancelEditCustomer"
);



if(cancelBtn){



cancelBtn.addEventListener(
"click",
function(){


currentCustomerId=null;


customerForm.reset();


document.getElementById(
"customerFormTitle"
).textContent =
"Nuevo cliente";


document.getElementById(
"saveCustomerBtn"
).textContent =
"Guardar cliente";


this.style.display="none";


});


}






loadCustomers();