<script lang="ts">
	import { tools } from '$lib/types/TimelineTypes';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Teller from './drawable/Teller.svelte';
	import { profile, result, username } from '$lib';
	import { nameInputVisible, resultTimeline } from '$lib/timelines/ResultTimeline';

	let isInputVisible: boolean = false;
	let nameInputNode: HTMLInputElement;
	let name: string;

	const onNextClicked = () => {
		if (nameInputNode.validity.valid) {
			nameInputVisible.set(false);
			username.set(name);
			tools.tellerNode?.continueTimeline();
		}
	};

	onMount(() => {
		nameInputVisible.subscribe((v) => {
			isInputVisible = v;
		});

		tools.tellerNode?.playTimeline(resultTimeline);
	});
</script>

<div class="w-screen h-[100dvh] flex flex-col items-center">
	<div class="w-screen p-3 lg:w-1/2 lg:p-0 h-[100dvh] flex flex-col justify-center items-center">
		<Teller bind:this={tools.tellerNode} />
		{#if isInputVisible}
			<div in:slide out:slide>
				<form class="flex flex-row gap-4">
					<input
						type="text"
						maxlength="15"
						minlength="1"
						bind:value={name}
						bind:this={nameInputNode}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder=""
						required
					/>
					<button
						on:click={onNextClicked}
						type="submit"
						class="inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
						><svg
							class=" h-5 w-5 text-gray-400 -rotate-90"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg></button
					>
				</form>
			</div>
		{/if}
	</div>
</div>
