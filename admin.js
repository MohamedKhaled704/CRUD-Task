const tableBody = document.getElementById('admin-table-body');
let productsPerPage = 20;
let currentPage = parseInt(localStorage.getItem('currentPage')) || 0;
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.previous');
const searchInput = document.getElementById('search');
const searchButton = document.querySelector('.search-button');
const deleteModal = document.querySelector('.delete-modal');
const yesDeleteButton = document.querySelector('.yes');
const noDeleteButton = document.querySelector('.no');

let productIdToDelete = null;

function createRow(product) {
    const row = document.createElement('tr');
    row.classList.add('product-row');
    row.setAttribute('data-product-id', product.id);
    row.innerHTML = `
        <td class="product-id" data-label="ID">${product.id}</td>
        <td class="product-name" colspan="2" data-label="Title">${product.title}</td>
        <td class="category-name" data-label="Category">${product.category.name}</td>
        <td class="category-id" data-label="Category ID">${product.category.id}</td>
        <td class="actions" data-label="Actions">
            <button class="view">View</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);

    const viewButton = row.querySelector('.view');
    const editButton = row.querySelector('.edit');
    const deleteButton = row.querySelector('.delete');

    viewButton.addEventListener('click', () => {
        alert(`Viewing product whose id is ${product.id}`);
        window.location.href = `view.html?id=${product.id}`;
    });

    editButton.addEventListener('click', () => {
        window.location.href = `create.html?id=${product.id}`;
    });

    deleteButton.addEventListener('click', (event) => {
        deleteModal.style.display = 'block';
        productIdToDelete = product.id;
    });
}

yesDeleteButton.addEventListener('click', () => {
    if (productIdToDelete) {
        fetch(`https://api.escuelajs.co/api/v1/products/${productIdToDelete}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                deleteModal.style.display = 'none';
                const productRow = document.querySelector(`.product-row[data-product-id="${productIdToDelete}"]`);
                if (productRow) {
                    productRow.remove();
                }
                alert('Product deleted successfully');
            } else {
                throw new Error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    }
});

noDeleteButton.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    productIdToDelete = null;
});

function displayProducts(offset = currentPage * productsPerPage) {
    fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${productsPerPage}`)
    .then(response => response.json())
    .then(data => {
        tableBody.innerHTML = '';
        data.forEach(product => {
            createRow(product);
        });

        prevButton.style.display = currentPage > 0 ? 'block' : 'none';
        nextButton.style.display = data.length < productsPerPage ? 'none' : 'block';
    })
    .catch(error => {
        console.log(error);
    });
}

displayProducts();

prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        localStorage.setItem('currentPage', currentPage);
        if (searchInput.value === '') {
            displayProducts();
        } else {
            displaySearchedProducts();
        }
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    localStorage.setItem('currentPage', currentPage);
    if (searchInput.value === '') {
        displayProducts();
    } else {
        displaySearchedProducts();
    }
});

function displaySearchedProducts() {
    const searchValue = searchInput.value;

    fetch(`https://api.escuelajs.co/api/v1/products`)
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';

            const searchedProducts = data.filter(product =>
                product.title.toLowerCase().includes(searchValue.trim().toLowerCase())
            );

            if (searchedProducts.length === 0) {
                tableBody.innerHTML = '<p>No products found.</p>';
            } else {
                const paginatedProducts = searchedProducts.slice(
                    currentPage * productsPerPage,
                    (currentPage + 1) * productsPerPage
                );

                paginatedProducts.forEach(product => createRow(product));

                prevButton.style.display = currentPage > 0 ? 'block' : 'none';
                nextButton.style.display =
                    (currentPage + 1) * productsPerPage >= searchedProducts.length ? 'none' : 'block';
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 0;
    displaySearchedProducts();
});