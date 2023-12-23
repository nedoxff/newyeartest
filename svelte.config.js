import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { importAssets } from 'svelte-preprocess-import-assets';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [importAssets(), vitePreprocess()],

	kit: {
		adapter: adapter({
			fallback: 'index.html',
			strict: true
		}),
		appDir: 'app',
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/projects/newyear' : ''
		}
	}
};

export default config;
