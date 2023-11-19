import ClosedEye from '$lib/assets/teller/eye-closed.svg';
import OpenedEye from '$lib/assets/teller/eye-outline.svg';
import anime from 'animejs';
import '$lib/extensions';
import { state } from '$lib';
import { AppState } from './AppState';

type TellerObjects = {
	misc: TellerMisc;
	eyes: TellerEyes;
	hands: TellerHands;
};
type TellerEyes = {
	leftEyeNode: HTMLImageElement | undefined;
	rightEyeNode: HTMLImageElement | undefined;
	close: (happy: boolean) => void;
	open: () => void;
};
type TellerHands = {
	leftHandNode: HTMLImageElement | undefined;
	rightHandNode: HTMLImageElement | undefined;
	moveLeftHand: (reverse: boolean) => void;
	moveRightHand: (reverse: boolean) => void;
};
type TellerMisc = {
	santaNode: HTMLImageElement | undefined;
	questionNode: HTMLImageElement | undefined;
	searchNode: HTMLImageElement | undefined;
	cardNode: HTMLImageElement | undefined;
	showSanta: (show: boolean) => void;
	showQuestion: () => void;
	showSearch: () => void;
	playCardAnimation: () => void;
	endCardAnimation: () => void;
	playQuizStartAnimation: () => void;
};

export const teller: TellerObjects = {
	misc: {
		santaNode: undefined,
		questionNode: undefined,
		searchNode: undefined,
		cardNode: undefined,
		showSanta: (show: boolean) => {
			anime({
				targets: teller.misc.santaNode,
				opacity: show ? 1 : 0,
				duration: 500,
				bottom: ['3rem', '3.5rem'].reverseIf(!show),
				easing: 'easeOutCubic'
			});
		},
		showQuestion: () => {
			anime({
				targets: teller.misc.questionNode,
				opacity: 1,
				duration: 500,
				bottom: ['3rem', '3.5rem'],
				easing: 'easeOutCubic'
			});
		},
		showSearch: () => {
			anime({
				targets: teller.misc.searchNode,
				opacity: 1,
				duration: 500,
				bottom: ['3rem', '3.5rem'],
				easing: 'easeOutCubic'
			});
		},
		playCardAnimation: () => {
			anime({
				targets: teller.hands.leftHandNode,
				rotateZ: ['-15deg', '-45deg'],
				left: ['-6rem', '-7rem'],
				bottom: ['-0.5rem', '13rem'],
				duration: 500,
				easing: 'easeOutCubic',
				complete: () => {
					anime({
						targets: teller.hands.leftHandNode,
						rotateZ: ['-45deg', '-110deg'],
						left: ['-7rem', '1.5rem'],
						duration: 250,
						delay: 500,
						easing: 'easeOutCubic',
						complete: () => {
							anime({
								targets: teller.hands.leftHandNode,
								left: ['1.5rem', '-3rem'],
								duration: 1000,
								delay: 1000,
								easing: 'easeOutCubic'
							});
							anime({
								targets: teller.misc.cardNode,
								opacity: 1,
								duration: 500,
								delay: 1000,
								easing: 'easeOutCubic'
							});
						}
					});
				}
			});
			anime({
				targets: teller.hands.rightHandNode,
				rotateZ: ['-15deg', '-45deg'],
				right: ['-6rem', '-7rem'],
				bottom: ['-0.5rem', '13rem'],
				duration: 500,
				easing: 'easeOutCubic',
				complete: () => {
					anime({
						targets: teller.hands.rightHandNode,
						rotateZ: ['-45deg', '-110deg'],
						right: ['-7rem', '1.5rem'],
						duration: 250,
						delay: 500,
						easing: 'easeOutCubic',
						complete: () => {
							anime({
								targets: teller.hands.rightHandNode,
								right: ['1.5rem', '-3rem'],
								duration: 1000,
								delay: 1000,
								easing: 'easeOutCubic'
							});
						}
					});
				}
			});
			anime({
				targets: [teller.misc.questionNode, teller.misc.searchNode],
				bottom: ['3.5rem', '16rem'],
				duration: 500,
				easing: 'easeOutCubic',
				complete: () => {
					anime({
						targets: teller.misc.questionNode,
						left: ['-6rem', '2.5rem'],
						opacity: 0,
						duration: 250,
						delay: 500,
						easing: 'easeOutCubic'
					});
					anime({
						targets: teller.misc.searchNode,
						right: ['-6rem', '2rem'],
						opacity: 0,
						duration: 250,
						delay: 500,
						easing: 'easeOutCubic'
					});
				}
			});
		},
		endCardAnimation: () => {
			anime({
				targets: teller.misc.cardNode,
				opacity: 0,
				bottom: ['12.5rem', '12rem'],
				duration: 500,
				easing: 'easeOutCubic'
			});
			anime({
				targets: teller.hands.leftHandNode,
				rotateZ: ['-110deg', '0deg'],
				scaleX: ['-100%', '100%'],
				bottom: ['13rem', '-1.5rem'],
				left: ['-3rem', '-2.25rem'],
				duration: 500,
				easing: 'easeOutCubic'
			});
			anime({
				targets: teller.hands.rightHandNode,
				rotateZ: ['-110deg', '0deg'],
				scaleX: ['100%', '-100%'],
				bottom: ['13rem', '-1.5rem'],
				right: ['-3rem', '-2.25rem'],
				duration: 500,
				easing: 'easeOutCubic'
			});
		},
		playQuizStartAnimation: () => {
			teller.eyes.leftEyeNode!.src = OpenedEye;
			teller.eyes.rightEyeNode!.src = OpenedEye;
			anime({
				targets: 'body',
				backgroundColor: '#ffffff',
				duration: 500,
				easing: 'easeInOutCubic'
			});
			anime({
				targets: '#teller-container',
				scale: 3.0,
				duration: 750,
				easing: 'easeInOutCubic',
				complete: () => setTimeout(() => state.set(AppState.Acquaintance), 1000)
			});
		}
	},
	hands: {
		moveLeftHand: (reverse: boolean) => {
			anime({
				targets: teller.hands.leftHandNode,
				left: ['-2.25rem', '-6rem'].reverseIf(reverse),
				bottom: ['-1.5rem', '-0.5rem'].reverseIf(reverse),
				scaleX: ['100%', '-100%'].reverseIf(reverse),
				rotateZ: ['0deg', '-15deg'].reverseIf(reverse),
				duration: 750,
				easing: 'easeOutCubic'
			});
		},
		moveRightHand: (reverse: boolean) => {
			anime({
				targets: teller.hands.rightHandNode,
				right: ['-2.25rem', '-6rem'].reverseIf(reverse),
				bottom: ['-1.5rem', '-0.5rem'].reverseIf(reverse),
				scaleX: ['-100%', '100%'].reverseIf(reverse),
				rotateZ: ['0deg', '-15deg'].reverseIf(reverse),
				duration: 750,
				easing: 'easeOutCubic'
			});
		},
		leftHandNode: undefined,
		rightHandNode: undefined
	},
	eyes: {
		close: (happy: boolean = false) => {
			if (
				teller.eyes.leftEyeNode?.src.includes(ClosedEye) &&
				teller.eyes.leftEyeNode?.style.transform.includes(`rotateZ(${happy ? 180 : 0}deg)`)
			)
				return;
			anime({
				targets: [teller.eyes.leftEyeNode, teller.eyes.rightEyeNode],
				opacity: 0,
				duration: 500,
				easing: 'easeOutCubic',
				complete: () => {
					teller.eyes.leftEyeNode!.src = ClosedEye;
					teller.eyes.rightEyeNode!.src = ClosedEye;
					teller.eyes.leftEyeNode!.style.transform = `rotateZ(${happy ? 180 : 0}deg)`;
					teller.eyes.rightEyeNode!.style.transform = `rotateZ(${happy ? 180 : 0}deg)`;
					anime({
						targets: [teller.eyes.leftEyeNode, teller.eyes.rightEyeNode],
						opacity: 1,
						duration: 250,
						easing: 'easeOutCubic'
					});
				}
			});
		},
		open: () => {
			if (teller.eyes.leftEyeNode?.src.includes(OpenedEye)) return;
			anime({
				targets: [teller.eyes.leftEyeNode, teller.eyes.rightEyeNode],
				opacity: 0,
				duration: 250,
				easing: 'easeOutCubic',
				complete: () => {
					teller.eyes.leftEyeNode!.src = OpenedEye;
					teller.eyes.rightEyeNode!.src = OpenedEye;
					anime({
						targets: [teller.eyes.leftEyeNode, teller.eyes.rightEyeNode],
						opacity: 1,
						duration: 500,
						easing: 'easeOutCubic'
					});
				}
			});
		},
		leftEyeNode: undefined,
		rightEyeNode: undefined
	}
};
