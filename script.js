let cart = [];
let currentUser = null;
let currentItem = null;

function generateStains() {
    const bg = document.getElementById('coffee-stain-bg');
    if (bg) { 
        bg.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const stain = document.createElement('div');
            stain.style.position = 'absolute';
            stain.style.width = Math.random() * 50 + 'px';
            stain.style.height = stain.style.width;
            stain.style.background = `rgba(139, 69, 19, ${Math.random() * 0.3})`;
            stain.style.borderRadius = '50%';
            stain.style.left = Math.random() * 100 + '%';
            stain.style.top = Math.random() * 100 + '%';
            stain.style.animation = `stain-shift ${Math.random() * 10 + 5}s infinite linear`;
            bg.appendChild(stain);
        }
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function editAddress() {
    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="profile-modal-content">
            <h2>My Address</h2>
            <textarea id="edit-address" placeholder="Enter your delivery address">${currentUser.address || ''}</textarea>
            <button class="save-btn" onclick="saveAddress()">Save</button>
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function saveAddress() {
    const address = document.getElementById('edit-address').value.trim();
    currentUser.address = address;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal();
    alert('Address updated!');
}

function closeModal() {
    document.querySelector('.profile-modal').remove();
}

function viewOrders() {
    const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.username}`)) || [];
    const modal = document.createElement('div');
    modal.className = 'orders-modal';
    let ordersHtml = '<h2>My Orders</h2>';
    if (orders.length === 0) {
        ordersHtml += '<p>No orders yet.</p>';
    } else {
        orders.forEach(order => {
            ordersHtml += `
                <div class="order-item">
                    <strong>Order Date:</strong> ${order.date}<br>
                    <strong>Items:</strong> ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}<br>
                    <strong>Total:</strong> ₱${order.total.toFixed(2)}<br>
                    <strong>Address:</strong> ${order.address}<br>
                    <strong>Payment:</strong> ${order.paymentMethod}
                </div>
            `;
        });
    }
    ordersHtml += '<button class="close-btn" onclick="closeOrdersModal()">Close</button>';
    modal.innerHTML = `<div class="orders-modal-content">${ordersHtml}</div>`;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeOrdersModal() {
    document.querySelector('.orders-modal').remove();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function showMessageModal(message) {
    const modal = document.createElement('div');
    modal.className = 'message-modal';
    modal.innerHTML = `
        <div class="message-modal-content">
            <p>${message}</p>
            <button class="ok-btn" onclick="closeMessageModal()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeMessageModal() {
    document.querySelector('.message-modal').remove();
}

document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }

    cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    generateStains();

    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.querySelectorAll('.menu-section').forEach(section => {
                section.style.display = 'none';
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });

    function updateCartIcon() {
        const cartIcon = document.querySelector('.cart');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(name, customDetails, price) {
        const cleanPrice = price.replace(/,/g, '');
        const existingItem = cart.find(item => item.name === name && item.customDetails === customDetails);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, customDetails, price: parseFloat(cleanPrice), quantity: 1 });
        }
        updateCartIcon();
        showMessageModal(`${name} added to cart!`);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartIcon();
        renderCart();
    }

    function clearCart() {
        cart = [];
        updateCartIcon();
        renderCart();
        localStorage.removeItem('cart');
    }

    function renderCart() {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalDiv = document.getElementById('cart-total');
        cartItemsDiv.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalDiv.textContent = 'Total: ₱0.00';
            return;
        }
        
        let total = 0;
        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name} (x${item.quantity})</div>
                    <div class="cart-item-price">₱${item.price.toFixed(2)} each</div>
                    <small>${item.customDetails}</small><br>
                    Subtotal: ₱${subtotal.toFixed(2)}
                </div>
                <button class="cart-item-remove">×</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
            itemDiv.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(index));
        });
        cartTotalDiv.textContent = `Total: ₱${total.toFixed(2)}`;
    }

    function openCustomizeModal(name, basePrice) {
        const cleanBasePrice = basePrice.replace(/,/g, '');
        currentItem = { name, basePrice: parseFloat(cleanBasePrice) };
        document.getElementById('customize-title').textContent = `Customize ${name}`;
        document.getElementById('customize-modal').style.display = 'flex';
        updateCustomizePrice();
    }

    function updateCustomizePrice() {
        if (!currentItem) return;
        const sizeMultiplier = parseFloat(document.getElementById('size-select').selectedOptions[0].getAttribute('data-multiplier'));
        let addOnPrice = 0;
        document.querySelectorAll('#customize-form input[type="checkbox"]:checked').forEach(cb => {
            addOnPrice += parseFloat(cb.getAttribute('data-price'));
        });
        const totalPrice = (currentItem.basePrice * sizeMultiplier) + addOnPrice;
        document.getElementById('customize-price').textContent = `Total: ₱${totalPrice.toFixed(2)}`;
    }

    function getCustomDetails() {
        const size = document.getElementById('size-select').value;
        const addOns = [];
        document.querySelectorAll('#customize-form input[type="checkbox"]:checked').forEach(cb => {
            addOns.push(cb.nextSibling.textContent.trim().split(' ')[0]);
        });
        const notes = document.getElementById('notes').value;
        let details = `Size: ${size}`;
        if (addOns.length > 0) details += `, Add-ons: ${addOns.join(', ')}`;
        if (notes) details += `, Notes: ${notes}`;
        return details;
    }

    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const isCustomizable = this.getAttribute('data-customize') === 'true';
            
            if (isCustomizable) {
                openCustomizeModal(name, price);
            } else {
                addToCart(name, 'No customization', price);
            }
        });
    });

    document.getElementById('size-select').addEventListener('change', updateCustomizePrice);
    document.querySelectorAll('#customize-form input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateCustomizePrice);
    });

    document.getElementById('add-customized-btn').addEventListener('click', function() {
        if (!currentItem) return;
        const customDetails = getCustomDetails();
        const sizeMultiplier = parseFloat(document.getElementById('size-select').selectedOptions[0].getAttribute('data-multiplier'));
        let addOnPrice = 0;
        document.querySelectorAll('#customize-form input[type="checkbox"]:checked').forEach(cb => {
            addOnPrice += parseFloat(cb.getAttribute('data-price'));
        });
        const totalPrice = (currentItem.basePrice * sizeMultiplier) + addOnPrice;
        addToCart(currentItem.name, customDetails, totalPrice.toString());
        document.getElementById('customize-modal').style.display = 'none';
        document.getElementById('customize-form').reset();
        currentItem = null;
    });

    document.getElementById('cancel-customize-btn').addEventListener('click', function() {
        document.getElementById('customize-modal').style.display = 'none';
        document.getElementById('customize-form').reset();
        currentItem = null;
    });

    document.getElementById('customize-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('customize-form').reset();
            currentItem = null;
        }
    });

    document.querySelector('.cart').addEventListener('click', function() {
        renderCart();
        document.getElementById('cart-modal').style.display = 'flex';
    });

    document.getElementById('close-cart-btn').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'none';
    });

    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        clearCart();
    });

    document.getElementById('cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showMessageModal('Your cart is empty!');
                return;
            }
            openCheckoutModal();
        });
    }

    function openCheckoutModal() {
        document.getElementById('checkout-name').value = currentUser.username || '';
        document.getElementById('checkout-address').value = currentUser.address || '';
        document.getElementById('checkout-phone').value = currentUser.phone || '';

        const checkoutItems = document.getElementById('checkout-items');
        checkoutItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `${item.name} (x${item.quantity}) - ₱${subtotal.toFixed(2)}<br><small>${item.customDetails}</small>`;
            checkoutItems.appendChild(itemDiv);
        });
        document.getElementById('checkout-total').textContent = `Total: ₱${total.toFixed(2)}`;
        
        document.getElementById('checkout-modal').style.display = 'flex';
    }

    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('checkout-name').value.trim();
        const address = document.getElementById('checkout-address').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        
        if (!address) {
            alert('Please enter a delivery address.');
            return;
        }

        currentUser.address = address;
        currentUser.phone = phone;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        const order = {
            date: new Date().toLocaleString(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            name,
            address,
            phone,
            paymentMethod
        };
        const orders = JSON.parse(localStorage.getItem(`orders_${currentUser.username}`)) || [];
        orders.push(order);
        localStorage.setItem(`orders_${currentUser.username}`, JSON.stringify(orders));
        
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('order-completed-modal').style.display = 'flex';
        clearCart();
    });

    document.getElementById('cancel-checkout-btn').addEventListener('click', function() {
        document.getElementById('checkout-modal').style.display = 'none';
    });

    document.getElementById('checkout-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    document.getElementById('close-order-modal-btn').addEventListener('click', function() {
        document.getElementById('order-completed-modal').style.display = 'none';
    });

    document.getElementById('order-completed-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-profile')) {
            document.getElementById('user-menu').style.display = 'none';
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    updateCartIcon();
});