const form = document.getElementById('create-form');
const productTitle = document.getElementById('product-title');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const productImage = document.getElementById('product-img');
const selectCat = document.getElementById('product-category');
const formTitle = document.querySelector('.create-h2');
const formButton = document.querySelector('.create-form-submit');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch('https://api.escuelajs.co/api/v1/categories')
.then(response => response.json())
.then(response => {
    response.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCat.appendChild(option);
    })
})


if (id) {
    fetch(`https://api.escuelajs.co/api/v1/products/${id}`)
    .then(response => response.json())
    .then(product => {
        // console.log(product);
        // console.log(product.images[0]); 
        formTitle.textContent = 'Edit Product';
        formButton.textContent = 'Update Product';
        productTitle.value = product.title;
        productDescription.value = product.description;
        productPrice.value = product.price;

        productImage.value = product.images[0];

        selectCat.value = product.category.id;
});
}



form.addEventListener('submit', (e) => {
    e.preventDefault()

    const productData = {
        title: productTitle.value,
        description: productDescription.value,
        images: [productImage.value],
        price: parseFloat(productPrice.value),
        categoryId: parseInt(selectCat.value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `https://api.escuelajs.co/api/v1/products/${id}` : 'https://api.escuelajs.co/api/v1/products/';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(response => {
            alert(id ? 'product updated successfully' : 'product created successfully')
            window.location.href = 'admin.html'
            form.reset()
        })
        .catch(error => console.error('Error:', error))

})