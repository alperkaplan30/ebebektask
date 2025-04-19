(() => {
    let currentIndex = 0;

    const fetchProducts = async () => {
        const localData = localStorage.getItem("productList");
        if (localData) return JSON.parse(localData);

        try {
            const response = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json");
            const data = await response.json();
            localStorage.setItem("productList", JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return null;
        }
    };

    const ratingHTML = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= rating ? 'filled' : ''}">&#9733;</span>`;
        }
        return `<div class="star-rating">${stars}</div>`;
    };

    const init = async () => {
        if (window.location.pathname !== "/") {
            console.log("wrong page");
        return;
        }
        const products = await fetchProducts();
        buildHTML(products);
        buildCSS();
        setEvents(products);
    };

    const buildHTML = (products) => {
        const wrapper = `
        <div class="carousel-wrapper">
            <div class="carousel-banner">
                <h2>Beğenebileceğinizi düşündüklerimiz</h2>
            </div>
            <div class="carousel-container">
                <div class="carousel-nav left-arrow">&#10094;</div>
                <div class="carousel-viewport">
                    <div class="product-carousel">
                        ${products.map(product => {
                            const isFav = checkIsFavorite(product.id);
                            const discount = calculateDiscount(product.original_price, product.price);
                            const hasDiscount = product.original_price !== product.price;

                            return `
                                <div class="carousel-item" data-discount="${hasDiscount}">
                                    <div class="heart ${isFav ? 'active' : ''}" data-id="${product.id}">
                                        <img src="https://www.e-bebek.com/assets/svg/default-favorite.svg" alt="Kalp" />
                                    </div>
                                    <a href="${product.url}" target="_blank">
                                        <img src="${product.img}" alt="${product.name}" />
                                        <p class="product-name"><strong>${product.brand}</strong> - ${product.name}</p>
                                    </a>
                                    ${ratingHTML(product.rating || 0)}
                                    <div class="price-area">
                                        ${hasDiscount
                                            ? `<div class="price-top">
                                                <span class="original-price"><s>${product.original_price} TL</s></span>
                                                <span class="discount-rate">%${discount} 🟢</span>
                                               </div>
                                               <span class="discount-price">${product.price} TL</span>`
                                            : `<span class="no-discount-price">${product.price} TL</span>`}
                                    </div>
                                    <button class="add-to-cart">Sepete Ekle</button>
                                </div>`;
                        }).join('')}
                    </div>
                </div>
                <div class="carousel-nav right-arrow">&#10095;</div>
            </div>
        </div>`;
        $(".hero.banner").after(wrapper);
    };

    const checkIsFavorite = (id) => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        return favorites.includes(id);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        const diff = originalPrice - currentPrice;
        return Math.round((diff / originalPrice) * 100);
    };

    const buildCSS = () => {
        const css = `
          .carousel-wrapper {
            background-color: white;
            margin: 0 auto;
            padding: 0;
            max-width: 1600px;
            position: relative;
          }
    
          .carousel-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #fef6eb;
            padding: 25px 67px;
            border-top-left-radius: 35px;
            border-top-right-radius: 35px;
            font-family: Quicksand-Bold;
            font-weight: 700;
          }
    
          .carousel-banner h2 {
            font-size: 2.2rem;
            color: #f28e00;
            margin: 0;
          }
    
          .carousel-container {
            position: relative;
            padding: 20px 67px;
            background-color: white;
          }
    
          .carousel-viewport {
            overflow: hidden;
            width: 100%;
          }
    
          .product-carousel {
            display: flex;
            transition: transform 0.4s ease-in-out;
          }
    
          .carousel-item {
            flex: 0 0 20%;
            height: 557px;
            font-family: Poppins, sans-serif;
            font-size: 12px;
            padding: 5px;
            background-color: white;
            color: #7d7d7d;
            border: 1px solid #ededed;
            border-radius: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-right: 15px;
          }
    
          .carousel-item:hover {
            border: 2px solid #f28e00;
          }
    
          .carousel-item img {
            width: 100%;
            height: auto;
          }
    
          .no-discount-price {
            font-size: 2.2rem;
            font-weight: 600;
            color: #7d7d7d;
            margin-top: 5px;
          }
    
          .heart {
            width: 25px;
            height: 25px;
            position: absolute;
            top: 13px;
            right: 12px;
          }
    
          .heart img {
            width: 100%;
            height: 100%;
          }
    
          .heart.active img {
            filter: brightness(0) saturate(100%) sepia(100%) hue-rotate(-20deg) saturate(1000%) brightness(85%);
          }
    
          .product-name {
            font-size: 1.2rem;
            margin: 8px 0;
            color: #7d7d7d;
            line-height: 1.4;
          }
    
          .star-rating {
            display: flex;
            gap: 2px;
            margin: 5px 0;
          }
    
          .star {
            color: #ccc;
            font-size: 14px;
          }
    
          .star.filled {
            color: #ffcc00;
          }
    
          .price-area {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
          }
    
          .price-top {
            display: flex;
            justify-content: space-between;
            font-size: 1.4rem;
            font-weight: 500;
          }
    
          .discount-price {
            font-size: 2.2rem;
            font-weight: 600;
            color: #00a365;
            margin-top: 5px;
          }
    
          .discount-rate {
            font-size: 1.4rem;
            font-weight: 600;
            color: #00a365;
          }
    
          .original-price {
            font-size: 1.4rem;
            font-weight: 500;
            color: #7d7d7d;
          }
    
          .add-to-cart {
            background-color: #fff3e6;
            color: #f28e00;
            font-weight: bold;
            border: none;
            border-radius: 25px;
            padding: 10px 20px;
            margin-top: 10px;
            cursor: pointer;
            width: 100%;
          }
    
          .add-to-cart:hover {
            background-color: #f28e00;
            color: white;
          }
    
          .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(242, 142, 0, 0.1);
            color: #f28e00;
            border: 2px solid transparent;
            border-radius: 50%;
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            z-index: 2;
          }
    
          .carousel-nav.left-arrow {
            left: -25px;
          }
    
          .carousel-nav.right-arrow {
            right: -25px;
          }
    
        
    
          @media (max-width: 1024px) {
            .carousel-item {
              flex: 0 0 25%;
              height: 510px;
            }
    
            .carousel-banner {
              padding: 20px 40px;
            }
    
            .carousel-container {
              padding: 20px 40px;
            }
    
            .carousel-banner h2 {
              font-size: 1.8rem;
            }
    
            .product-name {
              font-size: 1rem;
            }
    
            .discount-price,
            .no-discount-price {
              font-size: 1.8rem;
            }
    
            .price-top,
            .discount-rate,
            .original-price {
              font-size: 1.2rem;
            }
          }
    
          @media (max-width: 768px) {
            .carousel-item {
              flex: 0 0 33.33%;
              height: 480px;
            }
    
            .carousel-banner {
              flex-direction: column;
              padding: 15px 25px;
              text-align: center;
            }
    
            .carousel-container {
              padding: 15px 25px;
            }
    
            .carousel-banner h2 {
              font-size: 1.6rem;
            }
    
            .heart {
              width: 20px;
              height: 20px;
            }
    
            .product-name {
              font-size: 0.9rem;
            }
    
            .discount-price,
            .no-discount-price {
              font-size: 1.6rem;
            }
    
            .carousel-nav.left-arrow {
              left: -15px;
            }
    
            .carousel-nav.right-arrow {
              right: -15px;
            }
    
            .carousel-nav {
              width: 36px;
              height: 36px;
              font-size: 18px;
            }
          }
    
          @media (max-width: 480px) {
            .carousel-item {
              flex: 0 0 80%;
              margin-right: 10px;
              height: auto;
            }
    
            .carousel-banner {
              padding: 10px 15px;
            }
    
            .carousel-container {
              padding: 10px 15px;
            }
    
            .carousel-banner h2 {
              font-size: 1.4rem;
            }
    
            .product-name {
              font-size: 0.85rem;
            }
    
            .discount-price,
            .no-discount-price {
              font-size: 1.4rem;
            }
    
            .carousel-nav {
              width: 30px;
              height: 30px;
              font-size: 16px;
            }
    
            .add-to-cart {
              font-size: 0.9rem;
              padding: 8px 15px;
            }
          }
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };
    

          
        `;
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    const setEvents = (products) => {
        $(document).on('click', '.heart', function () {
            const id = $(this).data('id');
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
                $(this).removeClass('active');
            } else {
                favorites.push(id);
                $(this).addClass('active');
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });

        $(document).on('click', '.carousel-nav', function () {
            const direction = $(this).hasClass('left-arrow') ? -1 : 1;
            const itemWidth = $('.carousel-item').outerWidth(true);
            const maxIndex = products.length - 5;

            currentIndex += direction;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            const translateX = -currentIndex * itemWidth;
            $('.product-carousel').css('transform', `translateX(${translateX}px)`);
        });
    };

    if (typeof window.jQuery === "undefined") {
        const script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.onload = () => init();
        document.head.appendChild(script);
    } else {
        init();
    }
})();
