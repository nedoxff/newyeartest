<script lang="ts">
	import anime from 'animejs';
	import { testStorage } from '$lib/types/TestTypes';
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';

	export let id: string;
	export let text: string;
	export let onNextClicked: () => void;
	export let onSelected: () => void;
	let currentId: string;
	let enabled: boolean = true;
	let selectedCircleNode: HTMLDivElement;
	let containerNode: HTMLDivElement;
	let nextButtonNode: HTMLDivElement;

	const updateCurrentId = (newId: string) => {
		if (newId !== id && currentId !== id) return;
		const direction = () => newId === id;

		enabled = false;
		setTimeout(() => {
			enabled = true;
		}, 500);

		anime({
			targets: selectedCircleNode,
			boxShadow: [
				`inset 0px 0px 0px ${direction() ? 0.1 : 1}rem`,
				`inset 0px 0px 0px ${direction() ? 1 : 0.1}rem`
			],
			duration: 500,
			easing: 'easeInOutCubic'
		});
		anime({
			targets: containerNode,
			width: [`${direction() ? 100 : 85}%`, `${direction() ? 85 : 100}%`],
			duration: 500,
			easing: 'easeInOutCubic'
		});
		anime({
			targets: nextButtonNode,
			width: [`${direction() ? 0 : 15}%`, `${direction() ? 15 : 0}%`],
			duration: 500,
			easing: 'easeInOutCubic'
		});
		anime({
			targets: nextButtonNode.children[0],
			opacity: [direction() ? 0 : 1, direction() ? 1 : 0],
			duration: 500,
			easing: 'easeInOutCubic'
		});
		currentId = newId;
	};

	const onClicked = () => {
		if (currentId === id || !enabled) return;
		testStorage.currentSelectedButton.set(id);
		onSelected();
	};

	onMount(() => {
		testStorage.currentSelectedButton.subscribe(updateCurrentId);
	});
</script>

<div class="flex-row flex items-center h-full">
	<div
		class="bg-white py-2 px-4 w-full h-full rounded-3xl clickable flex-shrink"
		on:click={onClicked}
		bind:this={containerNode}
		id="answer-button-{id}"
	>
		<div class="flex flex-row h-full justify-start items-center gap-3">
			<div
				bind:this={selectedCircleNode}
				class="min-w-[1rem] min-h-[1rem] rounded-full button-initial-border"
			></div>
			<div lang={$locale} class="font-sans break-word hyphens-auto">{text}</div>
		</div>
	</div>
	<div
		bind:this={nextButtonNode}
		class="w-[0%] aspect-square flex-shrink bg-white rounded-full flex justify-center items-center overflow-hide clickable"
		on:click={onNextClicked}
	>
		<p class="font-sans font-bold text-2xl opacity-0">➜</p>
	</div>
</div>

<style>
	.button-initial-border {
		box-shadow: inset 0px 0px 0px 0.1rem #000;
	}

	.clickable:hover {
		cursor: pointer;
	}
</style>
