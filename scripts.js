// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) {
                mobileNav.classList.remove('open');
                menuButton.innerHTML = `
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        `;
            } else {
                mobileNav.classList.add('open');
                menuButton.innerHTML = `
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `;
            }
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileNav.classList.remove('open');
                menuButton.innerHTML = `
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        `;
            });
        });
    }
});

// Order Form Logic
document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('order-success');
    const totalPriceElement = document.getElementById('total-price');

    if (!orderForm) return;

    const coffeeTypes = [
        { id: "espresso", name: "Espresso Soomaaliyeed", price: 3.50 },
        { id: "latte", name: "Latte Macaan", price: 4.50 },
        { id: "spiced", name: "Qaxwo Xawaash", price: 5.00 },
        { id: "cold-brew", name: "Qaxwo Qabow", price: 4.75 },
        { id: "mocha", name: "Mocha Shukulaato", price: 5.25 },
        { id: "caramel", name: "Qaxwo Caadi", price: 2.75 },
    ];

    const sizes = [
        { id: "small", name: "Yar", priceMultiplier: 1 },
        { id: "medium", name: "Dhexe", priceMultiplier: 1.3 },
        { id: "large", name: "Weyn", priceMultiplier: 1.6 },
    ];

    function updateTotalPrice() {
        const coffeeType = orderForm['coffee-type'].value;
        const size = orderForm['size'].value;
        const quantity = parseInt(orderForm['quantity'].value) || 1;

        const selectedCoffee = coffeeTypes.find(c => c.id === coffeeType);
        const selectedSize = sizes.find(s => s.id === size);

        if (selectedCoffee && selectedSize) {
            const total = (selectedCoffee.price * selectedSize.priceMultiplier * quantity).toFixed(2);
            totalPriceElement.textContent = `$${total}`;
        } else {
            totalPriceElement.textContent = '$0.00';
        }
    }

    // Update price on form changes
    orderForm['coffee-type'].addEventListener('change', updateTotalPrice);
    orderForm['size'].addEventListener('change', updateTotalPrice);
    orderForm['quantity'].addEventListener('input', updateTotalPrice);

    // Form validation and button enable/disable
    function validateForm() {
        const name = orderForm['name'].value.trim();
        const phone = orderForm['phone'].value.trim();
        const address = orderForm['address'].value.trim();
        const coffeeType = orderForm['coffee-type'].value;

        const isValid = name && phone && address && coffeeType;
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = !isValid;
        }
    }

    // Add validation listeners
    orderForm['name'].addEventListener('input', validateForm);
    orderForm['phone'].addEventListener('input', validateForm);
    orderForm['address'].addEventListener('input', validateForm);
    orderForm['coffee-type'].addEventListener('change', validateForm);

    // Form submission
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(orderForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const coffeeType = formData.get('coffee-type');
        const size = formData.get('size');
        const quantity = formData.get('quantity');
        const instructions = formData.get('instructions');

        const selectedCoffee = coffeeTypes.find(c => c.id === coffeeType);
        const selectedSize = sizes.find(s => s.id === size);

        if (!selectedCoffee || !selectedSize) return;

        const coffeeName = selectedCoffee.name;
        const sizeName = selectedSize.name;
        const totalPrice = (selectedCoffee.price * selectedSize.priceMultiplier * parseInt(quantity)).toFixed(2);

        const message = `
*DALBO CUSUB - QAXWO WANAAG*
━━━━━━━━━━━━━━━━━━
*Macmiilka:* ${name}
*Telefoon:* ${phone}
*Cinwaan:* ${address}
━━━━━━━━━━━━━━━━━━
*Qaxwada:* ${coffeeName}
*Cabbirka:* ${sizeName}
*Tirada:* ${quantity}
*Wadarta:* $${totalPrice}
━━━━━━━━━━━━━━━━━━
*Farriin Gaar ah:* ${instructions || "Malaha"}
━━━━━━━━━━━━━━━━━━
Mahadsanid! ☕
    `.trim();

        const whatsappNumber = "252612387587";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");

        // Show success message
        orderForm.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset form after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            orderForm.style.display = 'block';
            orderForm.reset();
            updateTotalPrice();
            validateForm(); // Re-validate after reset
        }, 3000);
    });

    // Initialize total price
    updateTotalPrice();
});

// Add to Cart functionality
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const coffeeCard = this.closest('.card');
            const coffeeType = coffeeCard.getAttribute('data-coffee-type');

            if (coffeeType) {
                // Scroll to order form
                const orderSection = document.getElementById('order');
                if (orderSection) {
                    orderSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Pre-select coffee type in the form
                    const coffeeSelect = document.getElementById('coffee-type');
                    if (coffeeSelect) {
                        coffeeSelect.value = coffeeType;
                        // Trigger change event to update price
                        coffeeSelect.dispatchEvent(new Event('change'));
                    }
                }
            }
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
