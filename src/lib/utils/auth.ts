import { goto } from '$app/navigation';

let refreshPromise: Promise<void> | null = null;

export async function ensureValidToken() {
	const tokenExpiration = localStorage.getItem('tokenExpiration');
	if (!tokenExpiration || Date.now() > parseInt(tokenExpiration)) {
		if (!refreshPromise) {
			refreshPromise = refreshToken();
		}
		await refreshPromise;
		refreshPromise = null;
	}
}

async function refreshToken() {
	try {
		const response = await fetch('/api/auth/refresh', { method: 'POST' });
		if (!response.ok) {
			throw new Error('Token refresh failed');
		}
		const data = await response.json();
		localStorage.setItem('tokenExpiration', (Date.now() + data.expires_in * 1000).toString());
	} catch (error) {
		console.error('Failed to refresh token:', error);
		goto('/api/auth/login');
	}
}
