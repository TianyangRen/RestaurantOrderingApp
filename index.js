import { menuArray } from './data.js';

let order = [];
const menuContainer = document.getElementById('menu-container');
const orderSection = document.getElementById('order-section');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceEl = document.getElementById('total-price');
const completeOrderBtn = document.getElementById('complete-order-btn');
const paymentModal = document.getElementById('payment-modal');
const paymentForm = document.getElementById('payment-form');
const orderCompleteDiv = document.getElementById('order-complete');

// Render Menu
function renderMenu() {
    let menuHtml = '';
    menuArray.forEach(item => {
        menuHtml += `
        <div class="menu-item">
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-ingredients">${item.ingredients.join(', ')}</p>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="btn-container">
                <button class="add-btn" data-minus="${item.id}">-</button>
                <button class="add-btn" data-add="${item.id}">+</button>
            </div>
        </div>
        `;
    });
    menuContainer.innerHTML = menuHtml;
}

// Render Order
function renderOrder() {
    if (order.length === 0) {
        orderSection.style.display = 'none';
        return;
    }

    orderSection.style.display = 'block';
    
    let orderHtml = '';
    let totalPrice = 0;

    order.forEach((item, index) => {
        totalPrice += item.price;
        orderHtml += `
        <div class="order-item">
            <div class="item-details">
                <span class="order-item-title">${item.name}</span>
                <button class="remove-btn" data-remove="${index}">remove</button>
            </div>
            <div class="item-price">$${item.price}</div>
        </div>
        `;
    });

    orderItemsContainer.innerHTML = orderHtml;
    totalPriceEl.textContent = `$${totalPrice}`;
}

// Event Listeners
document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        const itemId = parseInt(e.target.dataset.add);
        const targetItem = menuArray.find(item => item.id === itemId);
        if (targetItem) {
            order.push(targetItem);
            renderOrder();
            renderMenu();
            // Clear success message if adding new items after completion
            orderCompleteDiv.style.display = 'none';
            orderCompleteDiv.innerHTML = ''; 
        }
    }
    else if (e.target.dataset.minus) {
        const itemId = parseInt(e.target.dataset.minus);
        // Find the index of the first occurrence of this item in the order array
        const itemIndex = order.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            order.splice(itemIndex, 1);
            renderOrder();
            renderMenu();
        }
    }
    else if (e.target.dataset.remove) {
        const itemIndex = parseInt(e.target.dataset.remove);
        order.splice(itemIndex, 1);
        renderOrder();
        renderMenu();
    }
    else if (e.target.id === 'complete-order-btn') {
        paymentModal.style.display = 'block';
    }
});

paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(paymentForm);
    const fullName = formData.get('fullName');
    
    // Simulate payment processing
    paymentModal.style.display = 'none';
    orderSection.style.display = 'none';
    order = []; // Clear order
    renderMenu();
    
    // Show success message
    orderCompleteDiv.style.display = 'block';
    orderCompleteDiv.innerHTML = `
        <div class="order-complete-message">
            Thanks, ${fullName}! Your order is on its way!
        </div>
    `;
    
    paymentForm.reset();
});


renderMenu();
paymentForm.reset();
