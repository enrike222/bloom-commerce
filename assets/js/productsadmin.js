const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const product = {

        nombre: document.getElementById("productName").value,

        precio: Number(
            document.getElementById("productPrice").value
        ),

        categoria: document.getElementById("productCategory").value,

        descripcion: document.getElementById("productDescription").value,

        estado: document.getElementById("productStatus").value

    };


    const { data, error } = await supabaseClient
        .from("productos")
        .insert([product]);


    if(error){

        console.error("Error guardando producto:", error);

        alert("No se pudo guardar el producto");

        return;

    }


    console.log("Producto guardado:", data);

    alert("Producto guardado correctamente");


    productForm.reset();

});