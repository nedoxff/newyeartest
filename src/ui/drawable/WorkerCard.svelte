<script lang="ts">
	import { onMount } from 'svelte';
	import { cardData } from '$lib';
	import anime from 'animejs';

	let cardNode: HTMLImageElement;
	export let onRevealed: () => void;
	export let onLoaded: () => void;

	onMount(() => {
		if ($cardData === undefined) throw new Error('card data blob was undefined');
		cardNode.onload = onLoaded;
		cardNode.src = window.URL.createObjectURL($cardData);
	});

	let revealed: boolean = false;

	const reveal = () => {
		if (revealed) return;
		revealed = true;
		anime({
			targets: '#card-container',
			rotateY: '90deg',
			duration: 500,
			easing: 'easeInCubic',
			complete: () => {
				(document.querySelector('#card-back') as HTMLImageElement).style.display = 'none';
				anime({
					targets: '#card-container',
					rotateY: '360deg',
					duration: 1000,
					easing: 'easeOutCubic',
					complete: () => {
						onRevealed();
					}
				});
			}
		});
	};
</script>

<div
	class="relative {`${revealed ? '' : 'hover:cursor-pointer'}`}"
	id="card-container"
	on:click={reveal}
>
	<img
		bind:this={cardNode}
		alt="employee card"
		class="w-full aspect-[500/275] absolute top-0 left-0"
		id="card"
	/>
	<div
		class="w-full aspect-[500/275] rounded-xl absolute top-0 left-0 bg-gray-600 z-10 flex flex-col justify-center items-center"
		id="card-back"
	>
		<img src="$lib/assets/teller/santa-claus.svg" alt="santa claus" class="h-1/2" />
	</div>
</div>
