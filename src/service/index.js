// src/services/apiService.js
import axios from 'axios';
import { configUrls } from './config';

const api = axios.create({
	baseURL: configUrls?.local, // Replace with your API base URL
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add token to headers if needed
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('usertoken'); // or wherever you store your token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle responses
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle errors globally
		if (error.response) {
			// Server responded with a status other than 2xx

			if (error.response.status === 401) {
				localStorage.removeItem('usertoken');
				window.location.href = '/'; // Redirect to login page if token is expired or invalid
			}
			// You can add custom error handling here
		} else if (error.request) {
			// No response from server
			console.error('Network error:', error.request);
		} else {
			// Other errors
			console.error('Error:', error.message);
		}
		return Promise.reject(error);
	}
);

export default api;
