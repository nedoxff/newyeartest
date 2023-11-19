import { writable, type Writable } from 'svelte/store';
import anime from 'animejs';
import type OrbBackground from '../../ui/drawable/OrbBackground.svelte';
import type AnimatedText from '../../ui/AnimatedText.svelte';

export type TestStorage = {
	backgroundNode?: OrbBackground;
	animatedTextNode?: AnimatedText;

	answerContainerNode?: HTMLDivElement;
	toggleAnswers: (show: boolean) => void;

	questionContentContainerNode?: HTMLDivElement;
	toggleQuestionContainer: () => void;
	toggleAnswerContainer: (idx: number) => void;

	currentSelectedButton: Writable<string>;
	currentQuestionIndex: number;
};

export let testStorage: TestStorage = {
	currentSelectedButton: writable(''),
	currentQuestionIndex: 0,
	toggleAnswers: (show: boolean) => {
		if (testStorage.answerContainerNode == null)
			throw new Error('testStorage.answerContainerNode was null when toggleAnswers was called');
		testStorage.answerContainerNode.style.pointerEvents = show ? 'auto' : 'none';
		anime({
			targets: testStorage.answerContainerNode,
			opacity: show ? 1 : 0,
			translateY: [show ? '15px' : '0px', show ? '0px' : '15px'],
			duration: 500,
			easing: 'easeInOutCubic'
		});
	},

	toggleAnswerContainer: (idx: number) => {
		if (testStorage.questionContentContainerNode == null)
			throw new Error(
				'testStorage.questionContentContainerNode was undefined when toggleAnswerContainer was called'
			);

		const children = Array.from(testStorage.questionContentContainerNode!.children).map(
			(ch) => ch as HTMLDivElement
		);

		const targetAnswerContainerId = `q-${testStorage.currentQuestionIndex + 1}-a${idx + 1}`;
		const targetAnswerContainer = children.find((ch) => ch.id === targetAnswerContainerId);
		if (targetAnswerContainer == null)
			throw new Error(`Cannot find an answer content container with id ${targetAnswerContainerId}`);

		const other = children.filter(
			(ch) => ch.id !== targetAnswerContainerId && ch.style.opacity !== '0'
		);

		anime({
			targets: other,
			opacity: 0,
			translateY: '15px',
			duration: 250,
			easing: 'easeInOutCubic'
		});
		setTimeout(() => {
			for (const child of other) child.style.display = 'none';
			targetAnswerContainer.style.display = '';
			anime({
				targets: targetAnswerContainer,
				opacity: 1,
				translateY: ['15px', '0px'],
				duration: 250,
				easing: 'easeInOutCubic'
			});
		}, 250);
	},
	toggleQuestionContainer: () => {
		if (testStorage.questionContentContainerNode == null)
			throw new Error(
				'testStorage.questionContentContainerNode was undefined when toggleQuestionContainer was called'
			);

		const children = Array.from(testStorage.questionContentContainerNode!.children).map(
			(ch) => ch as HTMLDivElement
		);
		const fadeOut = children.filter((ch) => ch.style.opacity !== '0');
		const fadeInId = `q-${testStorage.currentQuestionIndex + 1}-q`;
		const fadeIn = children.find((ch) => ch.id === fadeInId);

		if (fadeIn == null)
			throw new Error(`Cannot find a question content container with id ${fadeInId}`);

		anime({
			targets: fadeOut,
			opacity: 0,
			translateY: '15px',
			duration: 500,
			easing: 'easeInOutCubic'
		});
		setTimeout(() => {
			for (const child of fadeOut) child.style.display = 'none';
			fadeIn!.style.display = '';
			anime({
				targets: fadeIn,
				opacity: 1,
				translateY: ['15px', '0px'],
				duration: 500,
				easing: 'easeInOutCubic'
			});
		}, 250);
	}
};

export type Question = {
	text: string;
	delay: number;
	answer1: string;
	answer2: string;
};
