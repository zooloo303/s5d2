<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Auth from "$lib/components/Auth.svelte";
</script>

<ModeWatcher />
<div class="min-h-screen bg-background text-foreground">
	<header class="p-4 border-b">
		<div class="container mx-auto flex justify-between items-center">
			<h1 class="text-2xl font-bold">Destiny 2 Companion</h1>
			<Auth />
		</div>
	</header>
	<main class="container mx-auto py-8">
		<slot />
	</main>
</div>