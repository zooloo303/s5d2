import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	server: mode === 'development' ? {
		https: {
			key: fs.readFileSync('localhost-key.pem'),
			cert: fs.readFileSync('localhost.pem')
		},
		proxy: {}
	} : {}
}));
