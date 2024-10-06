import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BUNGIE_CLIENT_ID, BUNGIE_CLIENT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ fetch, cookies }) => {
	const refreshToken = cookies.get('refresh_token');

	if (!refreshToken) {
		throw error(401, 'No refresh token available');
	}

	const tokenResponse = await fetch('https://www.bungie.net/platform/app/oauth/token/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${BUNGIE_CLIENT_ID}:${BUNGIE_CLIENT_SECRET}`)}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: BUNGIE_CLIENT_ID
		})
	});

	if (!tokenResponse.ok) {
		throw error(500, 'Failed to refresh token');
	}

	const tokenData = await tokenResponse.json();

	cookies.set('access_token', tokenData.access_token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: tokenData.expires_in
	});
	cookies.set('refresh_token', tokenData.refresh_token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: tokenData.refresh_expires_in
	});

	return json({ success: true });
};
