const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const description = document.getElementById("productDescription").value;
    const status = document.getElementById("productStatus").value;

    console.log({
        name,
        price,
        category,
        description,
        status
    });

});