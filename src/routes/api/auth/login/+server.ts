import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BUNGIE_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async () => {
  const clientId = BUNGIE_CLIENT_ID;
  const state = Math.random().toString(36).substring(7);
  const authUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${encodeURIComponent(clientId)}&response_type=code&state=${encodeURIComponent(state)}`;

  return redirect(302, authUrl);
};
