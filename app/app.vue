<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <h1 class="text-2xl font-bold text-green-600">GadgetGuyUg</h1>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search products..."
          class="border rounded-md px-3 py-2 w-64"
        />
        <button @click="isCartOpen = true" class="relative">
          🛒
          <span
            v-if="cart.length"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2"
          >
            {{ cart.length }}
          </span>
        </button>
      </div>
    </header>

    <!-- Categories -->
    <nav class="bg-gray-100 border-b">
      <div class="flex gap-4 overflow-x-auto p-2">
        <button
          class="px-3 py-1 rounded-md"
          :class="activeCategory === 'all' ? 'bg-green-500 text-white' : 'bg-white border'"
          @click="setActiveCategory('all')"
        >
          All
        </button>
        <button
          v-for="cat in uniqueCategories"
          :key="cat"
          class="px-3 py-1 rounded-md"
          :class="activeCategory === cat ? 'bg-green-500 text-white' : 'bg-white border'"
          @click="setActiveCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </nav>

    <!-- Discount Banner -->
    <section class="bg-green-600 text-white text-center py-2">
      🎉 Big discounts on gadgets this week!
    </section>

    <!-- Products -->
    <main class="flex-1 max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer"
        @click="openProductDetails(product)"
      >
        <img
          :src="product.gallery[0] || '/placeholder.png'"
          alt=""
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-sm text-gray-500">{{ product.category }}</p>
          <p class="text-green-600 font-bold mt-2">
            UGX {{ getFeaturedVariant(product)?.price || '—' }}
          </p>
          <button
            v-if="product.variants.length"
            @click.stop="addToCart(product, product.variants[0])"
            class="mt-3 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>

    <!-- Reviews -->
    <section class="bg-gray-50 py-6">
      <h2 class="text-xl font-bold text-center mb-4">What our customers say</h2>
      <div
        class="animate-scroll"
        @mouseenter="pauseAnimation"
        @mouseleave="resumeAnimation"
      >
        <div
          v-for="(review, idx) in customerReviews"
          :key="idx"
          class="bg-white shadow rounded-lg p-4 min-w-[250px]"
        >
          <p class="italic">"{{ review.comment }}"</p>
          <p class="text-sm font-semibold mt-2">- {{ review.name }}</p>
          <p class="text-yellow-500">{{ '⭐'.repeat(review.rating) }}</p>
        </div>
      </div>
    </section>

    <!-- Cart Sidebar -->
    <div
      v-if="isCartOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      @click.self="isCartOpen = false"
    >
      <div class="bg-white w-80 p-4 flex flex-col">
        <h2 class="text-lg font-bold mb-4">Your Cart</h2>
        <div v-if="cart.length" class="flex-1 space-y-3 overflow-y-auto">
          <div
            v-for="item in cart"
            :key="item.cartId"
            class="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p class="font-semibold">{{ item.product.name }}</p>
              <p class="text-sm text-gray-500">{{ item.variant.name }}</p>
              <p class="text-green-600">UGX {{ item.variant.price }}</p>
            </div>
            <button @click="removeFromCart(item.cartId)" class="text-red-500">✖</button>
          </div>
        </div>
        <p v-else class="text-gray-500">Cart is empty</p>
        <a
          :href="whatsappCheckoutLink"
          target="_blank"
          class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-center"
        >
          Checkout on WhatsApp
        </a>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="selectedProduct = null"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button
          class="absolute top-2 right-2 text-gray-500"
          @click="selectedProduct = null"
        >
          ✖
        </button>
        <h2 class="text-xl font-bold mb-4">{{ selectedProduct.name }}</h2>
        <div class="flex gap-2 mb-4">
          <button @click="prevImage">◀</button>
          <img
            :src="selectedProduct.gallery[currentImageIndex] || '/placeholder.png'"
            class="w-64 h-64 object-cover mx-auto"
          />
          <button @click="nextImage">▶</button>
        </div>
        <p class="text-gray-600">{{ selectedProduct.description }}</p>
        <div class="mt-4 space-y-2">
          <div
            v-for="variant in selectedProduct.variants"
            :key="variant.name"
            class="flex justify-between items-center"
          >
            <span>{{ variant.name }}</span>
            <span class="text-green-600">UGX {{ variant.price }}</span>
            <button
              @click="addToCart(selectedProduct, variant)"
              class="bg-green-500 text-white px-2 py-1 rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- WhatsApp Floating Button -->
    <a
      href="https://wa.me/256758001240"
      target="_blank"
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
    >
      <img src="/whatsapp-button.png" alt="WhatsApp" class="w-full h-full" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Variant {
  name: string;
  price: number;
  isFeatured?: boolean;
}
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  gallery: string[];
  variants: Variant[];
}
interface CartItem {
  cartId: string;
  product: Product;
  variant: Variant;
}
interface Review {
  name: string;
  comment: string;
  rating: number;
}

const url =
  "https://zsjbajtd.api.sanity.io/v2025-02-20/data/query/production?query=*%5B_type%20%3D%3D%20'product'%5D";

const products = ref<Product[]>([]);
const cart = ref<CartItem[]>([]);
const isCartOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const currentImageIndex = ref(0);
const searchTerm = ref("");
const activeCategory = ref("all");

const customerReviews = ref<Review[]>([
  { name: "James", comment: "Fast delivery and great quality!", rating: 5 },
  { name: "Mary", comment: "Affordable prices. Recommended.", rating: 4 },
  { name: "Brian", comment: "Customer support was very helpful.", rating: 5 },
]);

const uniqueCategories = computed(() => [
  ...new Set(products.value.map((p) => p.category)),
]);

const filteredProducts = computed(() => {
  let items = products.value;
  if (activeCategory.value !== "all") {
    items = items.filter((p) => p.category === activeCategory.value);
  }
  if (searchTerm.value) {
    items = items.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  return items;
});

function getFeaturedVariant(product: Product) {
  return (
    product.variants.find((v) => v.isFeatured) ||
    product.variants[0] ||
    null
  );
}

function addToCart(product: Product, variant: Variant) {
  const cartItem: CartItem = {
    cartId: Date.now().toString(),
    product,
    variant,
  };
  cart.value.push(cartItem);
  saveCart();
}

function removeFromCart(cartId: string) {
  cart.value = cart.value.filter((c) => c.cartId !== cartId);
  saveCart();
}

function openProductDetails(product: Product) {
  selectedProduct.value = product;
  currentImageIndex.value = 0;
}

function nextImage() {
  if (!selectedProduct.value) return;
  currentImageIndex.value =
    (currentImageIndex.value + 1) % (selectedProduct.value.gallery.length || 1);
}

function prevImage() {
  if (!selectedProduct.value) return;
  currentImageIndex.value =
    (currentImageIndex.value - 1 + (selectedProduct.value.gallery.length || 1)) %
    (selectedProduct.value.gallery.length || 1);
}

function setActiveCategory(value: string) {
  activeCategory.value = value;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart.value));
}
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) cart.value = JSON.parse(saved);
}

const whatsappCheckoutLink = computed(() => {
  if (!cart.value.length) return "https://wa.me/256758001240";
  let text = "Hello! I'm interested in these products:%0A";
  cart.value.forEach((item) => {
    text += `- ${item.product.name} (${item.variant.name}) - UGX ${item.variant.price}%0A`;
  });
  return `https://wa.me/256758001240?text=${encodeURIComponent(text)}`;
});

// Reviews auto-scroll
let scrollInterval: number | null = null;
function pauseAnimation() {
  if (scrollInterval) clearInterval(scrollInterval);
}
function resumeAnimation() {
  startScrollAnimation();
}
function startScrollAnimation() {
  const el = document.querySelector<HTMLElement>(".animate-scroll");
  if (!el) return;
  scrollInterval = window.setInterval(() => {
    el.scrollLeft += 1;
    if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
  }, 20);
}

onMounted(async () => {
  loadCart();
  try {
    const response = await fetch(url);
    const { result } = await response.json();
    products.value = result.map((p: any) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      description: p.description,
      gallery: p.gallery || [],
      variants: p.variants || [],
    }));
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
  startScrollAnimation();
});

watch(cart, saveCart, { deep: true });
</script>

<style scoped>
.animate-scroll {
  display: flex;
  overflow-x: hidden;
  gap: 1rem;
  scroll-behavior: smooth;
}
</style>
