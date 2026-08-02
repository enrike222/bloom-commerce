                                                                                                                                                                                                                                                                                                                                                                                                                                                console.log("dashboard.js cargado");


async function loadDashboard(){


    // Productos

    const {count: productsCount, error: productsError} =
    await supabaseClient
    .from("productos")
    .select("*", {count:"exact", head:true});



    // Clientes

    const {count: customersCount, error: customersError} =
    await supabaseClient
    .from("clientes")
    .select("*", {count:"exact", head:true});




    // Pedidos

    const {count: ordersCount, error: ordersError} =
    await supabaseClient
    .from("pedidos")
    .select("*", {count:"exact", head:true});





    // Ventas

    const {data:salesData,error:salesError} =
    await supabaseClient
    .from("pedidos")
    .select("total");





    if(
        productsError ||
        customersError ||
        ordersError ||
        salesError
    ){

        console.error(
            "Error cargando dashboard"
        );

        return;

    }






    let totalSales = 0;


    salesData.forEach(order=>{

        totalSales += Number(order.total || 0);

    });






    document.getElementById("totalProducts").textContent =
    productsCount || 0;



    document.getElementById("totalCustomers").textContent =
    customersCount || 0;



    document.getElementById("totalOrders").textContent =
    ordersCount || 0;



    document.getElementById("totalSales").textContent =
    "Q" + totalSales.toFixed(2);



}




loadDashboard();