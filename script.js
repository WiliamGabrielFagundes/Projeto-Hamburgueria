const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsConteiner = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clouseModalBtn = document.getElementById("clouse-modal-btn");
const cartCouter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex";
    updateCartModal();
});

// fechar o modal do carrinho quando clicar fora
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

clouseModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
   let parentButton = event.target.closest (".add-to-cart-btn");

   if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        // adicionar no carrinho
        addToCart(name, price);
   }
});

//funçao para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // se o item ja existe aumenta a quantidade em +1
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();

};

// atualiza carinho
function updateCartModal() {
    cartItemsConteiner.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElements = document.createElement("div");

        cartItemsElements.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElements.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <P class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$: ${item.price.toFixed(2)}</p>
                </div>

                    <button class="remuve-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>

            </div>
        `

        total += item.price * item.quantity;

        cartItemsConteiner.appendChild(cartItemsElements);
    });

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCouter.innerHTML = cart.length;

};

// função para remover item do carrinho
cartItemsConteiner.addEventListener("click", function (event){
   if (event.target.classList.contains("remuve-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
   } 

});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
};

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

// finaliza pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops o restaurante esta fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }, 
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço R$${item.price} |`
        )
    }).join("");

    const menssage = encodeURIComponent(cartItems);
    const phone = "97907883";

    window.open(`https://wa.me/${phone}?text${menssage} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    //ou
    //cart.length = 0;
    updateCartModal();
});

// verifica a hora e manipuna horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 19; //horario-abertura-e-fechamento 
    // true = restaurante esta aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
