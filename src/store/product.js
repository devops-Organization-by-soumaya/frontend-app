import { create } from "zustand";

const apiUrl = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL=", apiUrl);

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: "Failed to create product." };
    }
  },

  fetchProducts: async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      set({ products: data.data || [] });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`${apiUrl}/api/products/${pid}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ products: state.products.filter((p) => p._id !== pid) }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Failed to delete product." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`${apiUrl}/api/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((p) => (p._id === pid ? data.data : p)),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Failed to update product." };
    }
  },
}));
