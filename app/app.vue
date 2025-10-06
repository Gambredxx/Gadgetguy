<template>
  <div>
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav class="border-b border-gray-200">
        <div class="container mx-auto px-4 py-4 flex justify-center items-center">
          <a href="/" class="flex items-center gap-3">
            <img src="/gadgetguyug-logo.png" alt="GadgetGuyUg Logo" class="h-10 w-auto" />
            <span class="text-xl font-black">GadgetGuyUg</span>
          </a>
        </div>
      </nav>
      <div class="bg-gray-100 text-center py-3 border-b border-gray-200">
        <p class="text-sm text-gray-600 font-semibold">
          Search and order genuine electronic gadgets, sourced from over 100+ trusted Ugandan dealers, with every product backed by a warranty.
        </p>
      </div>
      <section class="bg-gray-100 py-4 border-b border-gray-200">
        <div class="container mx-auto flex items-center gap-4 max-w-3xl px-4">
          <form class="flex-grow bg-white border border-gray-300 rounded-full overflow-hidden flex" @submit.prevent>
            <input v-model="searchTerm" type="search" placeholder="What gadget are you looking for?" class="w-full border-none outline-none py-3 px-6 font-semibold text-sm">
            <button type="submit" aria-label="Search" class="bg-blue-600 text-white px-6 font-bold hover:bg-blue-700 text-sm">Search</button>
          </form>
          <a @click="isCartOpen = true" class="relative p-2 cursor-pointer flex-shrink-0">
            <svg class="h-8 w-8 stroke-2 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span v-if="cartItemCount > 0" class="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {{ cartItemCount }}
            </span>
          </a>
        </div>
      </section>
      <nav class="bg-white border-b border-gray-200 hidden md:block">
        <div class="container mx-auto">
          <div class="flex justify-center items-center gap-8 text-sm text-gray-600">
            <a v-for="category in categories" :key="category.value" href="#" @click.prevent="setActiveCategory(category.value)" :class="{ 'text-blue-600 border-blue-600': activeCategory === category.value, 'border-transparent': activeCategory !== category.value }" class="py-3 border-b-2 hover:text-black">
              {{ category.title }}
            </a>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <div class="bg-red-600 text-white text-center py-4">
        <p class="text-lg font-bold animate-pulse shadow-[0_0_10px_red]">Enjoy a discount on all our products today 🔥</p>
      </div>

      <section id="all-products" class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-4xl font-extrabold text-center mb-12">All Products</h2>
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-2xl border border-gray-200 text-center cursor-pointer flex flex-col overflow-hidden group" @click="openProductDetails(product)">
              <div class="h-48 p-4 flex items-center justify-center">
                <img :src="product.gallery[0]" :alt="product.name" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div class="p-4 border-t border-gray-100 flex flex-col flex-grow">
                <h3 class="text-base font-bold h-12">{{ product.name }}</h3>
                <div class="flex justify-center items-baseline gap-2 mt-2">
                  <p v-if="product.variants.length > 1" class="text-xs text-gray-500 font-semibold">From</p>
                  <p class="text-lg font-extrabold text-blue-600">{{ formatPrice(getFeaturedPrice(product)) }}</p>
                  <p v-if="getFeaturedOriginalPrice(product)" class="text-sm text-gray-400 line-through">{{ formatPrice(getFeaturedOriginalPrice(product)) }}</p>
                </div>
                <button class="mt-4 w-full bg-gray-100 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors" @click.stop="addToCart(product.id, getFeaturedVariant(product).variantName)">Add to Cart</button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-10">
            <p>Loading products or none found...</p>
          </div>
        </div>
      </section>

      <section class="bg-gray-50 py-16 overflow-hidden">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold">What Our Customers Say</h2>
          </div>
          <div class="flex animate-scroll" @mouseover="pauseAnimation" @mouseleave="resumeAnimation">
            <div v-for="(review, index) in duplicatedReviews" :key="index" class="flex-shrink-0 w-80 bg-white p-6 rounded-2xl shadow-md mx-4">
              <div class="flex mb-4">
                <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= review.stars ? 'text-amber-400' : 'text-gray-300'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.135-.662 1.456 0l1.96 4.053a.75.75 0 00.563.41l4.47.652c.704.103.986.966.473 1.455l-3.234 3.149a.75.75 0 00-.216.664l.762 4.453c.121.702-.616 1.248-1.246.914l-4.002-2.103a.75.75 0 00-.702 0l-4.002 2.103c-.63.334-1.367-.212-1.246-.914l.762-4.453a.75.75 0 00-.216-.664l-3.234-3.149a.75.75 0 01.473-1.455l4.47-.652a.75.75 0 00.563-.41l1.96-4.053z" clip-rule="evenodd"></path></svg>
              </div>
              <p class="text-gray-600 font-semibold italic">"{{ review.text }}"</p>
              <p class="mt-4 font-bold text-sm">— {{ review.name }}, {{ review.location }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-gray-900 text-gray-400 py-16">
      <div class="container mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div class="space-y-4">
          <h4 class="font-bold text-white uppercase tracking-wider">About Us</h4>
          <ul class="space-y-2 text-sm">
            <a href="#" class="hover:text-white">About GadgetGuyUg</a>
            <li><a href="#" class="hover:text-white">Customer Reviews</a></li>
            <li><a href="#" class="hover:text-white">Leave feedback</a></li>
            <li><a href="#" class="hover:text-white">Become an affiliate</a></li>
          </ul>
        </div>
        <div class="space-y-4">
          <h4 class="font-bold text-white uppercase tracking-wider">Customer Service</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white">FAQs</a></li>
            <li><a href="#" class="hover:text-white">Warranty and Return Policy</a></li>
            <li><a href="#" class="hover:text-white">Return Policy</a></li>
            <li><a href="#" class="hover:text-white">Terms and Conditions</a></li>
          </ul>
        </div>
        <div class="space-y-4">
          <h4 class="font-bold text-white uppercase tracking-wider">Tools</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white">Price List</a></li>
          </ul>
        </div>
      </div>
      <div class="container mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        <p>© 2025 GadgetGuyUg. All Rights Reserved.</p>
      </div>
    </footer>

    <div class="fixed inset-0 bg-black/60 z-50 transition-opacity" :class="{ 'opacity-100 visible': isCartOpen || isDetailOpen, 'opacity-0 invisible': !isCartOpen && !isDetailOpen }" @click="isCartOpen = false; isDetailOpen = false">
      <div class="fixed top-0 right-0 h-full w-full max-w-md bg-white flex flex-col transition-transform duration-300" :class="{ 'translate-x-0': isCartOpen, 'translate-x-full': !isCartOpen }" @click.stop>
        <header class="p-6 border-b flex justify-between items-center"><h2 class="text-2xl">Your Cart</h2><button @click="isCartOpen = false" class="text-3xl text-gray-400 hover:text-black">&times;</button></header>
        <div class="flex-grow overflow-y-auto p-6">
          <div v-if="cart.length === 0" class="text-center text-gray-500 py-16">Your cart is empty.</div>
          <div v-else class="space-y-6">
            <div v-for="item in cart" :key="item.cartId" class="flex items-center gap-4">
              <img :src="getProductById(item.id)?.gallery[0]" class="w-20 h-20 object-contain rounded-lg border">
              <div class="flex-grow">
                <p class="font-bold">{{ getProductById(item.id)?.name }}</p>
                <p class="text-sm text-gray-500">{{ item.variantName }}</p>
                <p class="text-sm">{{ formatPrice(getVariantPrice(item.id, item.variantName)) }} x {{ item.quantity }}</p>
              </div>
              <button @click="removeFromCart(item.cartId)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600">&times;</button>
            </div>
          </div>
        </div>
        <footer v-if="cart.length > 0" class="p-6 border-t">
          <div class="flex justify-between items-baseline font-bold text-lg mb-4"><span>Total</span><span>{{ formatPrice(cartTotalPrice) }}</span></div>
          <a :href="whatsappCheckoutLink" target="_blank" class="block w-full text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600">Checkout on WhatsApp</a>
        </footer>
      </div>
      <div v-if="selectedProduct" class="fixed top-0 right-0 h-full w-full max-w-md bg-white flex flex-col transition-transform duration-300" :class="{ 'translate-x-0': isDetailOpen, 'translate-x-full': !isDetailOpen }" @click.stop>
        <header class="p-6 border-b flex justify-between items-center"><h2 class="text-2xl">Product Details</h2><button @click="isDetailOpen = false" class="text-3xl text-gray-400 hover:text-black">&times;</button></header>
        <div class="flex-grow overflow-y-auto p-6">
          <div class="relative mb-6">
            <img :src="selectedProduct.gallery[currentImageIndex]" :alt="selectedProduct.name" class="w-full h-80 object-contain rounded-xl">
            <button v-if="selectedProduct.gallery.length > 1" @click.stop="prevImage" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white focus:outline-none"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button v-if="selectedProduct.gallery.length > 1" @click.stop="nextImage" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white focus:outline-none"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
          </div>
          <div v-if="selectedProduct.gallery.length > 1" class="flex justify-center gap-2 mb-6">
            <img v-for="(img, index) in selectedProduct.gallery" :key="img" :src="img" @click.stop="currentImageIndex = index" class="h-16 w-16 object-contain rounded-md cursor-pointer gallery-thumbnail" :class="{ 'active': index === currentImageIndex }">
          </div>
          <h2 class="text-3xl font-extrabold mb-2">{{ selectedProduct.name }}</h2>
          <p class="text-gray-600 mb-6 leading-relaxed">{{ selectedProduct.description }}</p>
          <h3 class="font-bold text-sm uppercase text-gray-500 mb-4">Versions & Prices</h3>
          <div class="border border-gray-200 rounded-xl">
            <div v-for="(variant, index) in selectedProduct.variants" :key="variant.variantName" class="flex justify-between items-center p-4" :class="{ 'border-b border-gray-200': index < selectedProduct.variants.length - 1 }">
              <span class="font-semibold">{{ variant.variantName }}</span>
              <div class="flex items-baseline gap-3">
                <span v-if="variant.originalPrice && variant.originalPrice > variant.price" class="text-gray-400 line-through">{{ formatPrice(variant.originalPrice) }}</span>
                <span class="font-bold text-lg">{{ formatPrice(variant.price) }}</span>
              </div>
            </div>
          </div>
        </div>
        <footer class="p-6 border-t">
          <button class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700" @click="addToCart(selectedProduct.id, getFeaturedVariant(selectedProduct).variantName)">Add to Cart</button>
        </footer>
      </div>
    </div>

    <a href="https://wa.me/256791494234" target="_blank" class="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="Chat on WhatsApp">
      <img src="/whatsapp-button.png" alt="Chat on WhatsApp" class="w-full h-full object-cover rounded-full">
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

interface Variant { variantName: string; price: number; originalPrice?: number; isFeatured?: boolean; }
interface Product { id: string; name: string; category: string; gallery: string[]; description: string; variants: Variant[]; }
interface CartItem { id: string; variantName: string; quantity: number; cartId: string; }
interface Review { name: string; location: string; stars: number; text: string; }

const products = ref<Product[]>([]);
const cart = ref<CartItem[]>([]);
const searchTerm = ref('');
const activeCategory = ref('all');
const isCartOpen = ref(false);
const isDetailOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const currentImageIndex = ref(0);

const reviews: Review[] = [
  { name: "Mugisha I.", location: "Kampala", stars: 5, text: "Excellent service! My PS5 arrived the same day." },
  { name: "Nantongo S.", location: "Entebbe", stars: 5, text: "The iPhone 15 Pro was genuine and sealed. Best prices." },
  { name: "Okello J.", location: "Gulu", stars: 4, text: "Good customer care. Helped me choose the right laptop." },
  { name: "Achena P.", location: "Kampala", stars: 5, text: "I love my new JBL speaker. The sound is amazing." },
  { name: "Byamukama R.", location: "Mbarara", stars: 4, text: "Fast delivery and competitive prices." }
];
const duplicatedReviews = [...reviews, ...reviews];

const categories = [
  { title: 'All', value: 'all' },
  { title: 'Mobile Phones', value: 'mobiles' },
  { title: 'Laptops', value: 'laptops' },
  { title: 'Cameras', value: 'cameras' },
  { title: 'Audio', value: 'audio' },
  { title: 'Gaming', value: 'gaming' },
  { title: 'Accessories', value: 'accessories' }
];

// Sample products data - replace with your actual data source
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category: 'mobiles',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip.',
    gallery: ['/iphone15-pro.jpg'],
    variants: [
      { variantName: '128GB', price: 4500000, originalPrice: 4800000, isFeatured: true },
      { variantName: '256GB', price: 5000000, originalPrice: 5200000 },
      { variantName: '512GB', price: 5800000, originalPrice: 6000000 }
    ]
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    category: 'mobiles',
    description: 'Powerful Android smartphone with excellent display and performance.',
    gallery: ['/samsung-s24.jpg'],
    variants: [
      { variantName: '128GB', price: 3800000, originalPrice: 4000000, isFeatured: true },
      { variantName: '256GB', price: 4200000, originalPrice: 4400000 }
    ]
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    category: 'laptops',
    description: 'Thin and light laptop with M2 chip for exceptional performance.',
    gallery: ['/macbook-air-m2.jpg'],
    variants: [
      { variantName: '8GB/256GB', price: 5200000, originalPrice: 5500000, isFeatured: true },
      { variantName: '16GB/512GB', price: 6500000, originalPrice: 6800000 }
    ]
  },
  {
    id: '4',
    name: 'PlayStation 5',
    category: 'gaming',
    description: 'Next-gen gaming console with 4K graphics and fast loading.',
    gallery: ['/ps5.jpg'],
    variants: [
      { variantName: 'Standard Edition', price: 3200000, originalPrice: 3500000, isFeatured: true },
      { variantName: 'Digital Edition', price: 2800000, originalPrice: 3000000 }
    ]
  },
  {
    id: '5',
    name: 'JBL Flip 6',
    category: 'audio',
    description: 'Portable Bluetooth speaker with powerful sound and waterproof design.',
    gallery: ['/jbl-flip6.jpg'],
    variants: [
      { variantName: 'Black', price: 450000, originalPrice: 500000, isFeatured: true },
      { variantName: 'Blue', price: 450000, originalPrice: 500000 }
    ]
  },
  {
    id: '6',
    name: 'Canon EOS R50',
    category: 'cameras',
    description: 'Mirrorless camera perfect for vlogging and photography.',
    gallery: ['/canon-eos-r50.jpg'],
    variants: [
      { variantName: 'Body Only', price: 2800000, originalPrice: 3000000, isFeatured: true },
      { variantName: 'With Kit Lens', price: 3500000, originalPrice: 3800000 }
    ]
  }
];

const fetchProducts = async () => {
  try {
    // First try to fetch from external JSON file
    const res = await fetch('/products.json');
    if (res.ok) {
      products.value = await res.json();
    } else {
      // Fallback to sample data if fetch fails
      console.log('Using sample products data');
      products.value = sampleProducts;
    }
  } catch (err) {
    console.error('Error fetching products, using sample data:', err);
    // Fallback to sample data
    products.value = sampleProducts;
  }
};

onMounted(() => { 
  fetchProducts(); 
});

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchCategory = activeCategory.value === 'all' || product.category === activeCategory.value;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchCategory && matchSearch;
  });
});

const setActiveCategory = (category: string) => { activeCategory.value = category; };

const getProductById = (id: string) => products.value.find(p => p.id === id);

function getFeaturedVariant(product: Product): Variant {
  if (!product.variants || product.variants.length === 0)
    return { variantName: '', price: 0, originalPrice: 0, isFeatured: false };
  return product.variants.find(v => v.isFeatured) || product.variants[0];
}

const getFeaturedPrice = (product: Product) => getFeaturedVariant(product).price;
const getFeaturedOriginalPrice = (product: Product) => getFeaturedVariant(product).originalPrice;

const formatPrice = (value: number) => `UGX ${value.toLocaleString()}`;

const cartItemCount = computed(() => cart.value.reduce((acc, item) => acc + item.quantity, 0));
const cartTotalPrice = computed(() => cart.value.reduce((acc, item) => {
  const product = getProductById(item.id);
  if (!product) return acc;
  const variant = product.variants.find(v => v.variantName === item.variantName);
  return acc + (variant?.price || 0) * item.quantity;
}, 0));

const addToCart = (productId: string, variantName: string) => {
  const existing = cart.value.find(item => item.id === productId && item.variantName === variantName);
  if (existing) existing.quantity += 1;
  else cart.value.push({ id: productId, variantName, quantity: 1, cartId: `${productId}-${variantName}-${Date.now()}` });
};

const removeFromCart = (cartId: string) => {
  cart.value = cart.value.filter(item => item.cartId !== cartId);
};

const getVariantPrice = (productId: string, variantName: string) => {
  const product = getProductById(productId);
  if (!product) return 0;
  const variant = product.variants.find(v => v.variantName === variantName);
  return variant?.price || 0;
};

const whatsappCheckoutLink = computed(() => {
  if (cart.value.length === 0) return '';
  let text = 'Hello GadgetGuyUg, I would like to order the following products:%0A';
  cart.value.forEach(item => {
    const product = getProductById(item.id);
    if (product) text += `- ${product.name} (${item.variantName}) x${item.quantity}%0A`;
  });
  text += `Total: ${formatPrice(cartTotalPrice.value)}`;
  return `https://wa.me/256791494234?text=${text}`;
});

const openProductDetails = (product: Product) => { selectedProduct.value = product; currentImageIndex.value = 0; isDetailOpen.value = true; };
const nextImage = () => { if (!selectedProduct.value) return; currentImageIndex.value = (currentImageIndex.value + 1) % selectedProduct.value.gallery.length; };
const prevImage = () => { if (!selectedProduct.value) return; currentImageIndex.value = (currentImageIndex.value - 1 + selectedProduct.value.gallery.length) % selectedProduct.value.gallery.length; };

let animationPaused = false;
const pauseAnimation = () => animationPaused = true;
const resumeAnimation = () => animationPaused = false;
</script>

<style>
.gallery-thumbnail { border: 2px solid transparent; }
.gallery-thumbnail.active { border-color: #3b82f6; }
.animate-scroll { display: flex; animation: scroll 20s linear infinite; }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>