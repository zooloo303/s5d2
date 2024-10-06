<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import type { BungieUserProfile } from '$lib/utils/types';
	import { ensureValidToken } from '$lib/utils/auth';

	let user = $state<BungieUserProfile | null>(null);

	function login() {
		window.location.href = '/api/auth/login';
	}

	async function logout() {
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			user = null;
		}
	}

	async function fetchUser() {
		await ensureValidToken();
		const response = await fetch('/api/auth/user');
		if (response.ok) {
			user = await response.json();
			console.log('user :', user);
		}
	}

	onMount(fetchUser);
</script>

<div class="flex items-center space-x-4">
	{#if user}
		<span class="text-sm font-medium">Welcome, {user.displayName}</span>
		<Button variant="outline" onclick={logout}>Log out</Button>
	{:else}
		<Button onclick={login}>Log in with Bungie</Button>
	{/if}
</div>
