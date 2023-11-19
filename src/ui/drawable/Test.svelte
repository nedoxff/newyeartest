<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import anime from 'animejs';
	import OrbBackground from './OrbBackground.svelte';

	import AnswerButton from '../AnswerButton.svelte';
	import { testStorage, type Question } from '$lib/types/TestTypes';
	import { colors, getQuestions } from '$lib/timelines/Questions';
	import AnimatedText from '../AnimatedText.svelte';
	import { profile, state } from '$lib';
	import { AppState } from '$lib/types/AppState';

	let containerNode: HTMLDivElement;
	let questions: Question[];
	let answerText1: string;
	let answerText2: string;

	onMount(() => {
		anime({
			targets: 'body',
			backgroundColor: 'rgb(12, 10, 9)',
			duration: 500,
			delay: 1000,
			easing: 'easeInOutCubic',
			complete: () => {
				testStorage.backgroundNode?.setGlobalOpacity(0.25);
				testStorage.backgroundNode?.addOrb('initial', '#ffffff', 25, 50);
				questions = getQuestions();
				playQuestion(0);
			}
		});
		anime({
			targets: containerNode,
			opacity: 1,
			duration: 500,
			delay: 1000,
			easing: 'easeInOutCubic'
		});
	});

	const playQuestion = (idx: number) => {
		testStorage.currentQuestionIndex = idx;
		if (testStorage.animatedTextNode == null)
			throw new Error('testStorage.animatedTextNode was null when playQuestion was called');

		const question = questions[idx];
		answerText1 = question.answer1;
		answerText2 = question.answer2;
		testStorage.toggleQuestionContainer();
		testStorage.animatedTextNode.play(question.text, question.delay, () =>
			testStorage.toggleAnswers(true)
		);
	};

	const onNextQuestionClicked = (idx: number) => {
		profile.push(idx);
		anime({
			targets: [containerNode, '#orb-bg'],
			opacity: 0,
			translateY: '15px',
			delay: 500,
			easing: 'easeInOutCubic',
			complete: () => {
				testStorage.currentQuestionIndex++;
				if (testStorage.currentQuestionIndex > questions.length - 1) {
					anime({
						targets: [containerNode, '#orb-bg'],
						opacity: 0,
						translateY: '15px',
						delay: 500,
						easing: 'easeInOutCubic',
						complete: () => state.set(AppState.Intrigue)
					});
				} else {
					if (testStorage.animatedTextNode == null)
						throw new Error(
							'testStorage.animatedTextNode was null when onNextQuestionClicked was called'
						);

					testStorage.backgroundNode?.addOrb(
						testStorage.currentQuestionIndex.toString(),
						colors[idx][testStorage.currentQuestionIndex],
						25,
						50
					);
					testStorage.animatedTextNode!.reset();
					testStorage.currentSelectedButton.set('');
					testStorage.toggleAnswers(false);

					anime({
						targets: [containerNode, '#orb-bg'],
						opacity: 1,
						translateY: '0px',
						delay: 500,
						easing: 'easeInOutCubic'
					});
					playQuestion(testStorage.currentQuestionIndex);
				}
			}
		});
	};
</script>

<div class="w-full h-[100dvh] flex flex-col justify-center items-center">
	<div class="pointer-events-none">
		<OrbBackground bind:this={testStorage.backgroundNode} />
	</div>

	<!-- Container -->
	<div
		class="w-full lg:w-1/3 h-full p-4 items-stretch flex flex-col opacity-0"
		bind:this={containerNode}
	>
		<!-- Header -->
		<div class="flex flex-col flex-shrink">
			<div class="flex flex-row flex-shrink justify-between items-end w-full h-[8dvh]">
				<div class="flex flex-row items-end">
					<h1 class="bg-white rounded-xl text-black text-4xl p-2 h-min w-min">
						{$_('test.questionLetter')}{testStorage.currentQuestionIndex + 1}
					</h1>
					<p class="ml-1 text-white text-xl">/9</p>
				</div>
				<img src="$lib/assets/teller/crystal-ball-cropped.svg" class="h-full" />
			</div>
			<div class="relative">
				<div class="wavy"></div>
			</div>
		</div>
		<!-- Question content -->
		<div class="flex flex-col items-start flex-grow mt-6 mb-2">
			<AnimatedText alignment="left" size="3xl" bind:this={testStorage.animatedTextNode} />
			<div class="flex-grow w-full relative" bind:this={testStorage.questionContentContainerNode}>
				<div class="qcc" id="q-1-q">
					<img src="$lib/assets/test/work.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-1-a1">
					<img src="$lib/assets/test/person.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-1-a2">
					<img src="$lib/assets/test/group.svg" class="h-1/3" />
				</div>

				<div class="qcc" id="q-2-q">
					<img src="$lib/assets/test/gift.svg" class="h-1/3" />
					<img src="$lib/assets/teller/santa-claus.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-2-a1">
					<img src="$lib/assets/test/build.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-2-a2">
					<img src="$lib/assets/test/shopping-cart.svg" class="h-1/3" />
				</div>

				<div class="qcc" id="q-3-q">
					<img src="$lib/assets/test/talk.svg" class="h-1/3" />
					<img src="$lib/assets/test/important.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-3-a1">
					<img src="$lib/assets/test/alarm.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-3-a2">
					<img src="$lib/assets/test/bed.svg" class="h-1/3" />
				</div>

				<div class="qcc" id="q-4-q">
					<img src="$lib/assets/test/clover.svg" class="h-1/3" />
					<img src="$lib/assets/test/ticket.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-4-a1">
					<img src="$lib/assets/test/imagination.svg" class="h-1/3" />
					<img src="$lib/assets/test/eiffel-tower.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-4-a2">
					<img src="$lib/assets/test/search.svg" class="h-1/3" />
				</div>

				<div class="qcc" id="q-5-q">
					<img src="$lib/assets/test/fairy.svg" class="h-1/3" />
					<img src="$lib/assets/test/no-money.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-5-a1">
					<img src="$lib/assets/test/handshake.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-5-a2">
					<img src="$lib/assets/test/questions.svg" class="h-1/3" />
				</div>

				<div class="qcc gap-5" id="q-6-q">
					<img
						src="$lib/assets/test/6_1.jpg"
						class="w-full lg:w-[unset] h-3/4 rounded-2xl"
					/>
					<img
						src="$lib/assets/test/6_2.jpg"
						class="w-full lg:w-[unset] h-3/4 rounded-2xl"
					/>
				</div>
				<div class="qcc" id="q-6-a1">
					<img src="$lib/assets/test/6_1.jpg" class="h-3/4 rounded-2xl" />
				</div>
				<div class="qcc" id="q-6-a2">
					<img src="$lib/assets/test/6_2.jpg" class="h-3/4 rounded-2xl" />
				</div>

				<div class="qcc" id="q-7-q">
					<img src="$lib/assets/test/celebration.svg" class="h-1/3" />
					<img src="$lib/assets/test/confused.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-7-a1">
					<img src="$lib/assets/test/talk.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-7-a2">
					<img src="$lib/assets/test/hear.svg" class="h-1/3" />
				</div>

				<div class="qcc gap-3" id="q-8-q">
					<img src="$lib/assets/test/printer.svg" class="h-1/3" />
					<img src="$lib/assets/test/anger.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-8-a1">
					<img src="$lib/assets/test/speed.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-8-a2">
					<img src="$lib/assets/test/bed.svg" class="h-1/3" />
				</div>

				<div class="qcc" id="q-9-q">
					<img src="$lib/assets/test/gingerman.svg" class="h-1/3" />
					<img src="$lib/assets/test/anger.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-9-a1">
					<img src="$lib/assets/test/handshake.svg" class="h-1/3" />
				</div>
				<div class="qcc" id="q-9-a2">
					<img src="$lib/assets/test/restaurant.svg" class="h-1/3" />
				</div>
			</div>
		</div>
		<!-- Footer -->
		<div
			class="flex-shrink opacity-0 pointer-events-none"
			bind:this={testStorage.answerContainerNode}
		>
			<div class="flex flex-col gap-3 w-full h-full">
				<AnswerButton
					id="first"
					text={answerText1}
					onNextClicked={() => onNextQuestionClicked(0)}
					onSelected={() => testStorage.toggleAnswerContainer(0)}
				/>
				<AnswerButton
					id="second"
					text={answerText2}
					onNextClicked={() => onNextQuestionClicked(1)}
					onSelected={() => testStorage.toggleAnswerContainer(1)}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.wavy::before {
		/* lmao */
		content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
		position: absolute;
		width: 100%;
		overflow-x: hidden;
		font-size: 2rem;
		display: inline-block;
		top: -1em;
		color: transparent;
		text-decoration-style: wavy;
		text-decoration-color: #fff;
		text-decoration-line: underline;
	}

	/* question-content-container */
	.qcc {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
