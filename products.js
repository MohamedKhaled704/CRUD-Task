const productsContainer = document.querySelector('.products-container');
let productsPerPage = 9;
let currentPage = parseInt(localStorage.getItem('currentPage')) || 0;
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.previous');
const filterCatInput = document.getElementById('category');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const applyFilterButton = document.getElementById('apply-filter');
const resetFilterButton = document.getElementById('reset-filter');
const toTopButton = document.querySelector('.product-toTop');
let productElement;



fetch('https://api.escuelajs.co/api/v1/categories')
.then(response => response.json())
.then(data => {
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id
        option.textContent = category.name;
        filterCatInput.appendChild(option);
    })
})

function showProducts(product) {
            productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.setAttribute('data-cat', product.category.name);
            productElement.innerHTML = `
            <picture class="picture"><img alt="${product.title}"></picture>
                <h3 class="product-name">${product.title}</h3>
                <p class="product-category">${product.category.name}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
            `;
            let imgElement = productElement.querySelector('img');
            let image = new Promise((resolve, reject) => {
                let img = new Image();
                img.src = product.images[0];
                img.onload = () => resolve(img);
                img.onerror = () => {
                    img.src = './images/no-image-icon-23485.png';
                    reject(Error('Image failed to load'));
                };
                
            })
            image.then((img) => {
                imgElement.src = img.src;
            }).catch((error) => {
                imgElement.src = './images/no-image-icon-23485.png';
                console.log(error);
            })

                productElement.addEventListener('click', () => {
                    alert(`Viewing product whose name is "${product.title}"`);
                    window.location.href = `view.html?id=${product.id}`;
                })


            productsContainer.appendChild(productElement);
            // console.log(product.category.id);
}


function displayProducts(offset = currentPage * productsPerPage) {
    fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${productsPerPage}`)
    .then(response => response.json())
    .then(data => {
        productsContainer.innerHTML = '';
        localStorage.setItem('currentPage', currentPage);
        data.forEach(product => {
            showProducts(product);
        });

        prevButton.style.display = currentPage > 0 ? 'block' : 'none';
        nextButton.style.display = data.length < productsPerPage ? 'none' : 'block';
    })
    .catch(error => {
        console.log(error);
    });


}


displayProducts();



function displayFilteredProducts(offset = currentPage * productsPerPage) {
    const filterValue = filterCatInput.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;

    fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${productsPerPage}`)
        .then(response => response.json())
        .then(data => {
            productsContainer.innerHTML = '';

            const filteredProducts = data.filter(product =>
                filterValue === 'all' || String(product.category.id) === filterValue
            );

            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = '<p>No products found.</p>';
            } else {
                filteredProducts.forEach(product => showProducts(product));
            }

            prevButton.style.display = currentPage > 0 ? 'block' : 'none';
            nextButton.style.display = filteredProducts.length < productsPerPage ? 'none' : 'block';
        })
        .catch(error => console.error('Error fetching products:', error));

}




applyFilterButton.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 0; 
    displayFilteredProducts();
});


resetFilterButton.addEventListener('click', (e) => {
    e.preventDefault();
    filterCatInput.value = 'all'; 
    currentPage = 0; 
    displayProducts(); 
});


prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        if (filterCatInput.value === 'all') {
            displayProducts();
        } else {
            displayFilteredProducts();
        }
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    if (filterCatInput.value === 'all') {
        displayProducts();
    } else {
        displayFilteredProducts();
    }
});



resetFilterButton.addEventListener('click', (e) => {
    e.preventDefault();
    filterCatInput.value = 'all'; 
    currentPage = 0; 
    displayProducts(); 
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 1200) {
        toTopButton.style.display = 'block';
    } else {
        toTopButton.style.display = 'none';
    }
});
toTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});