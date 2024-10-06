import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	server:
		mode === 'development'
			? {
					https: {
						key: fs.readFileSync(path.resolve(__dirname, '../localhost-key.pem')),
						cert: fs.readFileSync(path.resolve(__dirname, '../localhost.pem'))
					},
					proxy: {}
				}
			: {}
}));
