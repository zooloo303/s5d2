import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BUNGIE_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ fetch, cookies }) => {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return json(null);
	}

	const response = await fetch(
		'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-API-Key': BUNGIE_API_KEY
			}
		}
	);

	if (!response.ok) {
		throw error(500, 'Failed to fetch user data');
	}

	const userData = await response.json();
	return json(userData.Response);
};
