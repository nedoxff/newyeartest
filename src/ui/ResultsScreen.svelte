<script lang="ts">
	import { cardData, result, userid, username } from '$lib';
	import { _, locale } from 'svelte-i18n';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import WorkerCard from './drawable/WorkerCard.svelte';
	import anime from 'animejs';

	let textVisible: boolean = false;
	let loading: boolean = false;
	let cardContainer: HTMLDivElement;

	const shareCard = async () => {
		if (location.protocol !== 'https:') return;
		loading = true;
		if ($cardData === undefined) return;

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (!isMobile) {
			try {
				navigator.clipboard.write([new ClipboardItem({ [$cardData.type]: $cardData })]).then(() => {
					alert($_('general.pcDevice'));
				});
			} catch (err) {
				console.log(`couldn't share the card: ${err}`);
			} finally {
				loading = false;
			}
		} else {
			const files = [new File([$cardData], `card_${userid}.png`, { type: $cardData.type })];
			if (navigator.canShare({ files })) {
				try {
					await navigator.share({ files });
				} catch (err) {
					console.log(`couldn't share the card: ${err}`);
				}
			} else {
				alert($_('general.deviceDoesNotSupportSharing'));
			}
			loading = false;
		}
	};

	const playAnimation = () => {
		setTimeout(() => {
			anime({
				targets: cardContainer,
				scale: [5, 1],
				opacity: [0, 1],
				translateY: ['15vh', '0vh'],
				duration: 2000,
				easing: 'easeInOutQuad'
			});
		}, 2000);
	};
</script>

<div class="w-full h-[100dvh] p-4 flex flex-col justify-center items-center">
	<div class="w-full lg:w-3/4 h-full flex flex-col items-center justify-center">
		{#if textVisible}
			<h1
				lang={get(locale)}
				class="w-full text-center text-white text-3xl font-bold mb-3"
				in:fly={{ y: 15, duration: 500 }}
			>
				{$_('names.you')}
				{$_(`names.${get(result)[0]}`)}!
			</h1>
		{/if}
		<div class="w-full lg:w-1/3 aspect-[500/275] opacity-0" bind:this={cardContainer}>
			<WorkerCard onLoaded={playAnimation} onRevealed={() => (textVisible = true)} />
		</div>
		{#if textVisible}
			<div class="flex flex-col items-center gap-2 mt-3" in:fly={{ y: 15, duration: 500 }}>
				<button
					on:click={shareCard}
					class="w-min inline-flex flex-row items-center bg-white rounded-full px-3 py-2 text-base shadow-sm"
					>{$_('general.share')}<svg
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
				{#if loading}
					<div role="status">
						<svg
							aria-hidden="true"
							class="w-8 h-8 m-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					</div>
				{/if}
				<p class="text-white text-xl w-full">{$_('general.thankYouForPlaying')}</p>
			</div>
		{/if}
	</div>
</div>
