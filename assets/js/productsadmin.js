console.log("productsadmin cargado");


const productForm = document.getElementById("productForm");


productForm.addEventListener("submit", async function(e) {

    e.preventDefault();


    const imageFile = document.getElementById("productImage").files[0];

    let imageUrl = null;


    // Subir imagen si existe
    if (imageFile) {

        const fileName = Date.now() + "-" + imageFile.name;


        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from("productos")
            .upload(fileName, imageFile);


        if (uploadError) {

            console.error("Error subiendo imagen:", uploadError);

            alert("No se pudo subir la imagen");

            return;

        }


        const { data: publicUrlData } = supabaseClient
            .storage
            .from("productos")
            .getPublicUrl(fileName);


        imageUrl = publicUrlData.publicUrl;

    }



    const product = {

        nombre: document.getElementById("productName").value,

        precio: Number(
            document.getElementById("productPrice").value
        ),

        categoria: document.getElementById("productCategory").value,

        descripcion: document.getElementById("productDescription").value,

        estado: document.getElementById("productStatus").value,

        imagen: imageUrl

    };



    console.log("Producto enviado:", product);



    const { data, error } = await supabaseClient
        .from("productos")
        .insert([product]);



    if(error){

        console.error(
            "Error guardando producto:",
            error
        );

        alert("No se pudo guardar el producto");

        return;

    }



    alert("Producto guardado correctamente");


    productForm.reset();


});