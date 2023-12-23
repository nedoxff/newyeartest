<script lang="ts">
	import { fly } from 'svelte/transition';
	import { tools, type Timeline, getCurrentFrame } from '$lib/types/TimelineTypes';
	import { teller } from '$lib/types/TellerAnimationsTypes';
	import OpenedEye from '$lib/assets/teller/eye-outline.svg';
	import AnimatedText from '../AnimatedText.svelte';

	export function continueTimeline(index?: number) {
		playFrame(index === undefined ? tools.currentFrameIndex + 1 : index);
	}

	export function playFrame(index: number) {
		if (getCurrentFrame() !== undefined) {
			const frame = getCurrentFrame();
			frame?.next?.(index);
		}
		tools.currentFrameIndex = index;
		const frame = getCurrentFrame();
		if (frame === undefined) {
			if (import.meta.env.DEV)
				console.warn(`specified frame at index ${index} was undefined. stopping the timeline`);
			tools.currentFrameIndex = -1;
			tools.currentTimeline = undefined;
			return;
		}
		frame.before?.();
		if (frame.type === 'default') {
			if (Array.isArray(frame.callbackDelay)) {
				throw new Error('frame.callbackDelay was not supposed to be number[] in default mode');
			}
			tools.textNode?.play(frame.text, frame.callbackDelay, frame.callback);
		} else {
			if (!Array.isArray(frame.callbackDelay)) {
				throw new Error('frame.callbackDelay was supposed to be number[] in formatted mode');
			}
			tools.textNode?.playFormatted(frame.text, frame.callbackDelay, frame.callback);
		}
	}

	export function playTimeline(timeline: Timeline) {
		tools.currentTimeline = timeline;
		playFrame(0);
	}
</script>

<div
	class="flex flex-col items-center w-1/3 md:w-1/6 lg:w-1/6 basis-0 no-scrollbar"
	id="teller-container"
>
	<div class="flex flex-row justify-center w-full h-16 mb-2 gap-2">
		<img
			src={OpenedEye}
			bind:this={teller.eyes.leftEyeNode}
			draggable="false"
			class="w-16"
			alt="eye svg"
		/>
		<img
			src={OpenedEye}
			bind:this={teller.eyes.rightEyeNode}
			draggable="false"
			class="w-16"
			alt="eye svg"
		/>
	</div>
	<div class="-mt-5 relative flex justify-center">
		<img
			bind:this={teller.misc.cardNode}
			src="$lib/assets/teller/card-account-details.svg"
			class="w-20 h-auto absolute"
			draggable="false"
			style="bottom: 12.5rem; opacity: 0; transform: scale(0.75)"
			alt="card account details svg"
		/>
		<img
			bind:this={teller.misc.santaNode}
			src="$lib/assets/teller/santa-claus.svg"
			class="w-20 h-auto absolute"
			draggable="false"
			style="left: -6rem; bottom: 3.5rem; opacity: 0"
			alt="santa claus svg"
		/>
		<img
			bind:this={teller.misc.questionNode}
			src="$lib/assets/teller/progress-question.svg"
			class="w-20 h-auto absolute"
			draggable="false"
			style="left: -6rem; bottom: 3.5rem; opacity: 0"
			alt="question svg"
		/>
		<img
			bind:this={teller.misc.searchNode}
			src="$lib/assets/teller/magnify.svg"
			class="w-20 h-auto absolute"
			draggable="false"
			style="right: -6rem; bottom: 3.5rem; opacity: 0"
			alt="magnifying glass svg"
		/>
		<img
			in:fly={{ x: -50, duration: 1500, delay: 250 }}
			bind:this={teller.hands.leftHandNode}
			src="$lib/assets/teller/hand-extended.svg"
			class="w-20 h-auto absolute -left-9 -bottom-6"
			draggable="false"
			alt="hand svg"
		/>
		<img
			src="$lib/assets/teller/crystal-ball-unmodified.svg"
			class="w-auto h-36"
			draggable="false"
			style="max-width: initial"
			alt="crystal ball svg"
		/>
		<img
			in:fly={{ x: -50, duration: 1500, delay: 250 }}
			bind:this={teller.hands.rightHandNode}
			src="$lib/assets/teller/hand-extended.svg"
			class="w-20 h-auto absolute -right-9 -bottom-6 -scale-x-100"
			draggable="false"
			alt="hand svg"
		/>
	</div>
</div>
<AnimatedText alignment="center" size="2xl" bind:this={tools.textNode} />
