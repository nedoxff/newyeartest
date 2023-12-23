<script lang="ts">
	const FADE_IN_ANIMATION_DURATION: number = 500;
	import { fly } from 'svelte/transition';

	let onShown: (() => void) | undefined;
	let onHidden: (() => void) | undefined;
	let delay: number;
	let chunks: string[] = [];
	let chunkContainer: HTMLDivElement;
	let visible: boolean = false;
	export let size: string;
	export let alignment: string;
	export function hide() {
		visible = false;
	}
	export function show() {
		visible = true;
	}
	export function forceSet(index: number, text: string) {
		chunkContainer.childNodes[index].textContent = text;
	}
	export function reset() {
		onShown = undefined;
		onHidden = undefined;
		chunks = [];
	}
	export function play(newText: string, newDelay: number, callback?: () => void) {
		if (!visible) {
			delay = newDelay;
			onShown = callback;
			chunks = [newText];
			visible = true;
		} else {
			onHidden = () => {
				delay = newDelay;
				onShown = callback;
				onHidden = undefined;
				chunks = [newText];
				visible = true;
			};
			visible = false;
		}
	}
	export function playFormatted(
		newText: string,
		delays: number[],
		callback?: (index: number) => void
	) {
		onShown = undefined;
		onHidden = () => {
			chunks = [];
			const split = newText.split('<action>');
			if (split.length != delays.length) {
				throw new Error('the number of chunks must match the number of delays');
			}
			if (split.length === 1) {
				play(split[0], delays[0], () => callback?.(0));
				return;
			}
			//all callbacks that have text after it
			for (let i = 0; i < split.length - 1; i++) {
				setTimeout(
					() => {
						callback?.(i);
						chunks = [...chunks, split[i + 1]];
					},
					(FADE_IN_ANIMATION_DURATION + delays[i]) * (i + 1)
				);
			}
			//end callback
			setTimeout(
				() => {
					callback?.(split.length - 1);
				},
				(FADE_IN_ANIMATION_DURATION + delays[split.length - 1]) * (split.length - 1)
			);
			chunks = [split[0]];
			visible = true;
		};
		if (!visible) onHidden();
		else visible = false;
	}
</script>

{#if visible}
	<div
		class="flex flex-row gap-x-2 flex-wrap justify-{alignment === 'center'
			? 'center'
			: 'start'} mt-2 mb-2"
		bind:this={chunkContainer}
	>
		{#each chunks as chunk, i}
			{#key chunk}
				<h1
					class="text-white {`text-${size}`} {`text-${alignment}`}"
					transition:fly|global={{ y: 15, duration: FADE_IN_ANIMATION_DURATION, opacity: 0 }}
					on:introend={() => {
						if (chunks.length === 1 && i === 0) setTimeout(() => onShown?.(), delay);
					}}
					on:outroend={() => {
						if (i === 0) onHidden?.();
					}}
				>
					{chunk}
				</h1>
			{/key}
		{:else}
			<h1 class="text-white {`text-${size}`} {`text-${alignment}`}">​</h1>
		{/each}
	</div>
{/if}
