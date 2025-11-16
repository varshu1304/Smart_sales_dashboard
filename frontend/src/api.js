// frontend/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Sales Summary
export const fetchSummary = (filters = {}) =>
  axios.get(`${BASE}/sales/summary`, { params: filters }).then(r => r.data);

// Sales Trend
export const fetchTrend = (filters = {}) =>
  axios.get(`${BASE}/sales/trend`, { params: filters }).then(r => r.data);

// Region Breakdown
export const fetchByRegion = (filters = {}) =>
  axios.get(`${BASE}/sales/by-region`, { params: filters }).then(r => r.data);

// Salesperson Breakdown
export const fetchBySalesperson = (filters = {}) =>
  axios.get(`${BASE}/sales/by-salesperson`, { params: filters }).then(r => r.data);

// Products List
export const fetchProducts = () =>
  axios.get(`${BASE}/sales/products`).then(r => r.data);

// Product Summary
export const fetchProductSummary = () =>
  axios.get(`${BASE}/sales/product-summary`).then(r => r.data);


// Fetch all orders
export const fetchOrders = () => {
  return axios.get(`${BASE}/sales/orders`).then(r => r.data);
};

// Fetch order summary
export const fetchOrderSummary = () => {
  return axios.get(`${BASE}/sales/orders/summary`).then(r => r.data);
};
