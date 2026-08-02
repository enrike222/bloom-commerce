console.log("customers.js cargado");


async function loadCustomers(){


    const { data, error } = await supabaseClient

        .from("clientes")

        .select("*")

        .order("created_at", {
            ascending:false
        });



    if(error){

        console.error(
            "Error cargando clientes:",
            error
        );

        return;

    }



    const table = document.getElementById(
        "customersTable"
    );



    if(!table) return;



    table.innerHTML = "";



    if(data.length === 0){


        table.innerHTML = `

        <tr>

        <td colspan="5" class="empty-state">

        No hay clientes registrados.

        </td>

        </tr>

        `;


        return;

    }




    data.forEach(cliente => {



        const row = document.createElement("tr");



        row.innerHTML = `


        <td>
        ${cliente.nombre}
        </td>


        <td>
        ${cliente.email}
        </td>


        <td>
        ${cliente.telefono || "Sin teléfono"}
        </td>


        <td>
        ${cliente.direccion || "Sin dirección"}
        </td>


        <td>


        <button onclick="viewCustomer('${cliente.id}')">

        Ver

        </button>


        </td>



        `;



        table.appendChild(row);



    });



}





function viewCustomer(id){


    alert(
        "Cliente ID: " + id
    );


}





loadCustomers();