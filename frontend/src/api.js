import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Fetch overall KPI summary
export const fetchSummary = (filters = {}) => {
  return axios
    .get(`${BASE}/sales/summary`, { params: filters })
    .then(r => r.data);
};

// Fetch sales trend chart data
export const fetchTrend = (filters = {}) => {
  return axios
    .get(`${BASE}/sales/trend`, { params: filters })
    .then(r => r.data);
};

// Fetch region-wise breakdown
export const fetchByRegion = (filters = {}) => {
  return axios
    .get(`${BASE}/sales/by-region`, { params: filters })
    .then(r => r.data);
};

// Fetch salesperson-wise breakdown
export const fetchBySalesperson = (filters = {}) => {
  return axios
    .get(`${BASE}/sales/by-salesperson`, { params: filters })
    .then(r => r.data);
};

// Fetch detailed sales table data with pagination + filters
export const fetchSales = (page = 1, pageSize = 200, filters = {}) => {
  return axios
    .get(`${BASE}/sales`, {
      params: {
        page,
        pageSize,
        ...filters
      }
    })
    .then(r => r.data);
};
