<script lang="ts">
	import { onMount } from 'svelte';
	import { bngBaseUrl } from '$lib/utils/helpers';
	import type { UserData } from '$lib/utils/types';
	import { Button } from '$lib/components/ui/button';
	import { ensureValidToken } from '$lib/utils/auth';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	// State
	let isLoading = $state(true);
	let user = $state<UserData | null>(null);
	let avatarUrl = $derived(user?.bungieNetUser.profilePicturePath || '');
	let avatarFallback = $derived(user?.bungieNetUser.displayName.slice(0, 2).toUpperCase());

	function login() {
		window.location.href = '/api/auth/login';
	}

	async function logout() {
		isLoading = true;
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			user = null;
		}
		isLoading = false;
	}

	async function fetchUser() {
		isLoading = true;
		await ensureValidToken();
		const response = await fetch('/api/auth/user');
		if (response.ok) {
			user = await response.json();
		}
		isLoading = false;
	}

	onMount(fetchUser);
</script>

<div class="flex items-center space-x-4">
	{#if isLoading}
		<Button disabled>
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Loading...
		</Button>
	{:else if user}
		<div class="flex items-center space-x-2">
			<Avatar>
				<AvatarImage src={`${bngBaseUrl}${avatarUrl}`} alt={user.bungieNetUser.displayName} />
				<AvatarFallback>{avatarFallback}</AvatarFallback>
			</Avatar>
			<span class="text-sm font-medium">Welcome, {user.bungieNetUser.displayName}</span>
		</div>
		<Button variant="outline" onclick={logout}>Log out</Button>
	{:else}
		<Button onclick={login}>Log in with Bungie</Button>
	{/if}
</div>
