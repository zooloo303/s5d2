import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BUNGIE_CLIENT_ID, BUNGIE_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code || !state) {
		throw error(400, 'Invalid OAuth callback');
	}

	const tokenResponse = await fetch('https://www.bungie.net/platform/app/oauth/token/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${BUNGIE_CLIENT_ID}:${BUNGIE_CLIENT_SECRET}`)}`
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: BUNGIE_CLIENT_ID
		})
	});

	if (!tokenResponse.ok) {
		throw error(500, 'Failed to obtain access token');
	}

	const tokenData = await tokenResponse.json();

	// Store the tokens securely (you may want to encrypt these)
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

	// Redirect to the home page or a dashboard
	return redirect(302, '/');
};

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	return new Response(null, { status: 302, headers: { Location: '/' } });
};
