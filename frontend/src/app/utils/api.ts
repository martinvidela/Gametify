'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized (optional: logout user)
    }

    return response;
};

export const getIgdbImageUrl = (url: string | undefined, size: string = 't_cover_big') => {
    if (!url) return "https://images.unsplash.com/photo-1612285330342-999335ad39be?auto=format&fit=crop&q=80&w=2070";
    let formattedUrl = url.replace('t_thumb', size);
    if (formattedUrl.startsWith('//')) {
        formattedUrl = `https:${formattedUrl}`;
    }
    return formattedUrl;
};
