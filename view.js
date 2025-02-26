const productCard = document.querySelector('.product-details');
const urlParams = new URLSearchParams( window.location.search );
const productId = urlParams.get('id');
const backButton = document.getElementById('back');


backButton.addEventListener('click', () => {
    window.location.href = 'products.html';
})


fetch(`https://api.escuelajs.co/api/v1/products/${productId}`)
.then(response => response.json())
.then(product => {
    console.log(product);
    productCard.innerHTML = `
                <div class="left">
                <picture class="picture"><img ></picture>
                </div>
                <div class="right">
                <h3 class="product-name">${product.title}</h3>
                <p class="product-category">category: ${product.category.name}</p>
                <p class="product-price">$${product.price}</p>
                <p class="product-description">${product.description}</p>
                </div> 
    `;
    let imgElement = productCard.querySelector('img');
    let img = new Image();
    img.alt = product.title;
    img.src = product.images[0];
    img.onload = () => {
        imgElement.src = img.src;
    };
    img.onerror = () => {
        imgElement.src = './images/no-image-icon-23485.png';
        console.error('Image failed to load');
    };

})