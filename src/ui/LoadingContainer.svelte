<script lang="ts">
	import { loaded, loadedFolders } from '$lib';
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
	let preloadingContainerNode: HTMLImageElement;
	let preloadCounter: number = 0;
	let preloadCount: number = 0;
	let totalCounter: number = 0;
	let totalCount: number = 0;

	export async function loadFolder(name: string, data: Record<string, () => Promise<unknown>>) {
		preloadCounter = 0;

		const extension = (u: string) => u.split(/[#?]/)[0].split('.').pop()?.trim();

		let urls: string[] = [];
		// weird vite thing: https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
		for (const url in data) {
			urls.push(
				new URL(
					`../lib/assets/${name}/${url
						.replace(/^.*[\\/]/, '')
						.replace(/\.[^/.]+$/, '')}.${extension(url)}`,
					import.meta.url
				).href
			);
		}
		preloadCount = urls.length;

		const load = (index: number) =>
			new Promise<void>((resolve) => {
				try {
					preloadingContainerNode.src = urls[index];
					preloadingContainerNode.onload = () => {
						resolve();
					};
				} catch (e) {
					console.error(`failed to load image: ${e}`);
					resolve(); // the error is not critical since the image will load later anyways
				}
			});
		while (preloadCounter < urls.length) {
			await load(preloadCounter);
			preloadCounter++; // for loop doesn't trigger the update
		}

		loadedFolders.set(name, urls);
		totalCounter++;
	}

	export async function preload() {
		const folders = new Map<string, Record<string, () => Promise<unknown>>>([
			['test', import.meta.glob('../lib/assets/test/*.*')],
			['teller', import.meta.glob('../lib/assets/teller/*.*')],
			['results', import.meta.glob('../lib/assets/results/*.*')]
		]);
		totalCount = folders.size;
		for (let [name, data] of folders) await loadFolder(name, data);
	}

	onMount(async () => {
		if (document.readyState === 'complete') {
			await preload();
			loaded.set(true);
		} else {
			window.onload = async () => {
				await preload();
				loaded.set(true);
			};
		}
	});
</script>

<div
	class="w-screen h-[100dvh] bg-stone-950 flex flex-col justify-center items-center absolute top-0"
	in:fly
	out:fly={{ delay: 500 }}
>
	<div class="lg:w-1/2 w-full p-3 text-center">
		<h1 class="text-white text-5xl tracking-tight font-semibold">{$_('loading')}</h1>
		<h2 lang={$locale} class="text-white text-xl hyphens-auto mt-2 font-normal">
			{$_('loading_description')}
		</h2>
		<div class="lds-grid mt-1">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		<h4 class="text-white text-xl font-normal">
			({preloadCounter}/{preloadCount}) • ({totalCounter}/{totalCount})
		</h4>
		<img bind:this={preloadingContainerNode} alt="image loader" class="w-px h-px opacity-0" />
	</div>
</div>

<style>
	.lds-grid {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-grid div {
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		animation: lds-grid 1.2s linear infinite;
	}
	.lds-grid div:nth-child(1) {
		top: 8px;
		left: 8px;
		animation-delay: 0s;
	}
	.lds-grid div:nth-child(2) {
		top: 8px;
		left: 32px;
		animation-delay: -0.4s;
	}
	.lds-grid div:nth-child(3) {
		top: 8px;
		left: 56px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(4) {
		top: 32px;
		left: 8px;
		animation-delay: -0.4s;
	}
	.lds-grid div:nth-child(5) {
		top: 32px;
		left: 32px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(6) {
		top: 32px;
		left: 56px;
		animation-delay: -1.2s;
	}
	.lds-grid div:nth-child(7) {
		top: 56px;
		left: 8px;
		animation-delay: -0.8s;
	}
	.lds-grid div:nth-child(8) {
		top: 56px;
		left: 32px;
		animation-delay: -1.2s;
	}
	.lds-grid div:nth-child(9) {
		top: 56px;
		left: 56px;
		animation-delay: -1.6s;
	}
	@keyframes lds-grid {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
