<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { fly, slide } from 'svelte/transition';
	import { locale } from 'svelte-i18n';
	import { tools } from '$lib/types/TimelineTypes';
	import { startTimeline, startTimelineStorage } from '$lib/timelines/StartTimeline';
	import { get } from 'svelte/store';

	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import Teller from './drawable/Teller.svelte';
	import { onMount } from 'svelte';
	/* if (import.meta.hot) {
		import.meta.hot.on('vite:afterUpdate', () => {
			window.location.reload();
		});
	} */
	console.log(`loaded successfully | locale: ${$locale}`);

	let genericButtonNode: HTMLButtonElement;
	function onGenericButtonClicked() {
		startTimelineStorage.genericButtonVisible.set(false);
		if (
			genericButtonNode!.hasAttribute('data-jumpto') &&
			genericButtonNode!.getAttribute('data-jumpto') != '-1'
		) {
			const index: number = parseInt(
				genericButtonNode!.getAttribute('data-jumpto') ??
					(() => {
						throw new Error('data-jumpto in a generic button was not a number.');
					})()
			);
			genericButtonNode!.removeAttribute('data-jumpto');
			tools.tellerNode?.continueTimeline(index);
		} else tools.tellerNode?.continueTimeline();
	}
	function onGenericButtonCreated(node: HTMLButtonElement) {
		genericButtonNode = node;
		//textContent is set automatically
		const jumpTo = get(startTimelineStorage.genericButtonJumpTo);
		if (jumpTo !== undefined) node.setAttribute('data-jumpto', jumpTo.toString());
	}

	locale.subscribe(() => {
		tools.textNode?.forceSet(0, $_('welcome.hello'));
	});

	let languageSwitcherVisible: boolean = false;
	let genericButtonVisible: boolean = false;
	let requestButtonsVisible: boolean = false;
	startTimelineStorage.languageSwitcherVisible.subscribe((v) => (languageSwitcherVisible = v));
	startTimelineStorage.genericButtonVisible.subscribe((v) => (genericButtonVisible = v));
	startTimelineStorage.requestButtonsVisible.subscribe((v) => (requestButtonsVisible = v));

	onMount(() => {
		tools.tellerNode?.playTimeline(startTimeline);
	});
</script>

<div class="w-screen h-[100dvh] flex flex-col items-center">
	<div class="w-screen p-3 lg:w-1/2 lg:p-0 h-[100dvh] flex flex-col justify-center items-center">
		<Teller bind:this={tools.tellerNode} />
		{#if languageSwitcherVisible}
			<span in:slide out:slide>
				<div
					class="flex flex-row gap-2"
					in:fly={{ x: 0, y: 5, delay: 1000, duration: 500, opacity: 0 }}
					out:fly={{ x: 0, y: 5, duration: 500, opacity: 0 }}
				>
					<LanguageSwitcher />
					<button
						on:click={() => tools.tellerNode?.continueTimeline()}
						class="inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
						>{$_('welcome.continue')}<svg
							class="-mr-1 h-5 w-5 text-gray-400 -rotate-90"
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
				</div>

				<h4
					in:fly={{ x: 0, y: 5, delay: 1000, duration: 500, opacity: 0 }}
					out:fly={{ x: 0, y: 5, duration: 500, opacity: 0 }}
					class="text-white absolute bottom-3 left-0 w-screen text-center"
				>
					version: {__VERSION_TAG__} • {__LAST_COMMIT_HASH__}
				</h4>
			</span>
		{/if}
		{#if genericButtonVisible}
			<span in:slide out:slide>
				<div
					class="flex flex-row gap-2"
					in:fly={{ x: 0, y: 5, delay: 1000, duration: 500, opacity: 0 }}
					out:fly={{ x: 0, y: 5, duration: 500, opacity: 0 }}
				>
					<button
						bind:this={genericButtonNode}
						use:onGenericButtonCreated
						on:click={onGenericButtonClicked}
						class="inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
						>{get(startTimelineStorage.genericButtonText)}<svg
							class="-mr-1 h-5 w-5 text-gray-400 -rotate-90"
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
				</div>
			</span>
		{/if}
		{#if requestButtonsVisible}
			<span in:slide out:slide>
				<div
					class="flex flex-row gap-2"
					in:fly={{ x: 0, y: 5, delay: 1000, duration: 500, opacity: 0 }}
					out:fly={{ x: 0, y: 5, duration: 500, opacity: 0 }}
				>
					<button
						on:click={() => tools.tellerNode?.continueTimeline(4)}
						class="inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
						>{$_('welcome.buttons.yes')}<svg
							class="-mr-1 h-5 w-5 text-gray-400 -rotate-90"
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
					<button
						on:click={() => tools.tellerNode?.continueTimeline(1000)}
						class="inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
						>{$_('welcome.buttons.no')}<svg
							class="-mr-1 h-5 w-5 text-gray-400 -rotate-90"
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
				</div>
			</span>
		{/if}
	</div>
</div>
