import { goto } from '$app/navigation';

const MAX_RETRIES = 3;
let retryCount = 0;
let refreshPromise: Promise<void> | null = null;

export async function ensureValidToken() {
	const tokenExpiration = localStorage.getItem('tokenExpiration');
	const parsedExpiration = tokenExpiration ? parseInt(tokenExpiration) : 0;

	if (!tokenExpiration || isNaN(parsedExpiration) || Date.now() > parsedExpiration) {
		if (!refreshPromise) {
			refreshPromise = refreshToken();
		}
		try {
			await refreshPromise;
		} catch (error) {
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				return ensureValidToken();
			} else {
				console.error('Max retries reached, redirecting to login', error);
				goto('/api/auth/login');
			}
		} finally {
			refreshPromise = null;
			retryCount = 0;
		}
	}
}

async function refreshToken() {
	const TIMEOUT_MS = 10000; // 10 seconds

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error('Token refresh failed');
		}

		const data = await response.json();

		if (typeof data.expires_in === 'number' && !isNaN(data.expires_in)) {
			const newExpiration = Date.now() + data.expires_in * 1000;
			localStorage.setItem('tokenExpiration', newExpiration.toString());
		} else {
			console.error('Invalid expires_in value:', data.expires_in);
		}
	} catch (error) {
		if (error.name === 'AbortError') {
			console.error('Token refresh timeout');
		} else {
			console.error('Failed to refresh token:', error);
		}
		goto('/api/auth/login');
	}
}
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
	await ensureValidToken();

	const response = await fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});

	if (response.status === 401) {
		// Token might have expired right after the check
		await refreshToken();
		return authenticatedFetch(url, options);
	}

	return response;
}
