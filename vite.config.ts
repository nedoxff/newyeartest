import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import * as child from 'child_process';

const lastCommitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__VERSION_TAG__: JSON.stringify('1.1release'),
		__LAST_COMMIT_HASH__: JSON.stringify(lastCommitHash)
	}
});
