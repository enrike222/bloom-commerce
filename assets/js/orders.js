console.log("orders.js cargado");



let ordersData = [];





// ==============================
// CARGAR PEDIDOS
// ==============================


async function loadOrders(){


const {data,error}=

await supabaseClient

.from("pedidos")

.select(`

id,

total,

estado,

fecha_entrega,

metodo_pago,

created_at,


clientes(

nombre,

email,

telefono

)

`)

.order(

"created_at",

{

ascending:false

}

);





if(error){

console.error(
"Error cargando pedidos:",
error
);

return;

}




ordersData = data;



renderOrders(data);



}







// ==============================
// MOSTRAR PEDIDOS
// ==============================


function renderOrders(orders){



const table =
document.getElementById(
"ordersTable"
);



if(!table)return;



table.innerHTML="";





if(!orders.length){


table.innerHTML=`

<tr>

<td colspan="8" class="empty-state">

No hay pedidos registrados.

</td>

</tr>

`;

return;


}






orders.forEach(order=>{



const row =
document.createElement("tr");




row.innerHTML=`

<td>

#${order.id.slice(0,8)}

</td>



<td>

${order.clientes?.nombre || "Cliente eliminado"}

</td>



<td>

${order.clientes?.email || "-"}

<br>

${order.clientes?.telefono || ""}

</td>



<td>

Q${order.total || 0}

</td>



<td>

${order.metodo_pago || "Pendiente"}

</td>



<td>


<select onchange="changeOrderStatus('${order.id}',this.value)">


<option ${order.estado==="Pendiente"?"selected":""}>
Pendiente
</option>


<option ${order.estado==="Confirmado"?"selected":""}>
Confirmado
</option>


<option ${order.estado==="Preparando"?"selected":""}>
Preparando
</option>


<option ${order.estado==="Enviado"?"selected":""}>
Enviado
</option>


<option ${order.estado==="Entregado"?"selected":""}>
Entregado
</option>


<option ${order.estado==="Cancelado"?"selected":""}>
Cancelado
</option>


</select>


</td>



<td>

${order.created_at?.split("T")[0]}

</td>




<td>


<button onclick="showOrderDetails('${order.id}')">

👁️ Ver

</button>


</td>


`;



table.appendChild(row);



});



}









// ==============================
// CAMBIAR ESTADO
// ==============================


async function changeOrderStatus(id,status){



const {error}=

await supabaseClient

.from("pedidos")

.update({

estado:status

})

.eq(

"id",

id

);





if(error){

console.error(error);

return;

}



loadOrders();



}









// ==============================
// DETALLES DEL PEDIDO
// ==============================


async function showOrderDetails(id){



const box =
document.getElementById(
"orderDetails"
);



const {data,error}=

await supabaseClient

.from("pedidos")

.select(`

*,

clientes(

nombre,

email,

telefono,

direccion

),


detalle_pedidos(

cantidad,

precio,

productos(

nombre

)

)

`)

.eq(

"id",

id

)

.single();






if(error){

console.error(error);

return;

}





box.innerHTML=`

<div class="admin-card">


<h3>

Pedido #${data.id.slice(0,8)}

</h3>



<p>

👤 ${data.clientes.nombre}

</p>


<p>

📧 ${data.clientes.email}

</p>


<p>

📞 ${data.clientes.telefono}

</p>



<h4>

Productos

</h4>



${

data.detalle_pedidos.map(item=>`

<p>

🌸 ${item.productos.nombre}

x${item.cantidad}

-

Q${item.precio}

</p>

`).join("")

}



<hr>



<h3>

Total:

Q${data.total}

</h3>



</div>

`;



}









// ==============================
// BUSCADOR
// ==============================


const search =
document.getElementById(
"orderSearch"
);



if(search){


search.addEventListener(
"input",
function(){



const value =
this.value.toLowerCase();



const filtered =
ordersData.filter(order=>

order.id.toLowerCase().includes(value)

||

order.clientes?.nombre.toLowerCase().includes(value)

);



renderOrders(filtered);



});


}






loadOrders();