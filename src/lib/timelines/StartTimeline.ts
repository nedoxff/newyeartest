import { tools, type Timeline } from '$lib/types/TimelineTypes';
import { get, writable, type Writable } from 'svelte/store';
import { format } from 'svelte-i18n';
import { state } from '$lib';
import { teller } from '$lib/types/TellerAnimationsTypes';
import { AppState } from '$lib/types/AppState';

export type StartTimelineStorage = {
	languageSwitcherVisible: Writable<boolean>;

	genericButtonVisible: Writable<boolean>;
	genericButtonJumpTo: Writable<number | undefined>;
	genericButtonText: Writable<string>;
	showGenericButton: (text: string, jumpTo?: number) => void;

	requestButtonsVisible: Writable<boolean>;
};
export let startTimelineStorage: StartTimelineStorage = {
	languageSwitcherVisible: writable(false),

	genericButtonVisible: writable(false),
	genericButtonJumpTo: writable(-1),
	genericButtonText: writable(''),
	showGenericButton: (text: string, jumpTo?: number) => {
		startTimelineStorage.genericButtonText.set(text);
		startTimelineStorage.genericButtonJumpTo.set(jumpTo);
		startTimelineStorage.genericButtonVisible.set(true);
	},

	requestButtonsVisible: writable(false)
};

export let startTimeline: Timeline = () => [
	{
		id: 0,
		type: 'default',
		text: get(format)('welcome.hello'),
		callbackDelay: 1000,
		callback: () => startTimelineStorage.languageSwitcherVisible.set(true),
		next: () => {
			startTimelineStorage.languageSwitcherVisible.set(false);
			teller.eyes.close(false);
		}
	},
	{
		id: 1,
		type: 'default',
		text: get(format)('welcome.dialog1'),
		callbackDelay: 5000,
		callback: () => startTimelineStorage.showGenericButton('?')
	},
	{
		id: 2,
		type: 'formatted',
		text: get(format)('welcome.dialog2'),
		callbackDelay: [500, 500, 2000],
		callback: (index?: number) => {
			switch (index) {
				case 0: {
					teller.misc.showSanta(true);
					break;
				}
				case 1: {
					teller.eyes.open();
					break;
				}
				case 2: {
					startTimelineStorage.showGenericButton(get(format)('welcome.buttons.ok'));
					break;
				}
			}
		},
		before: () => setTimeout(() => teller.hands.moveLeftHand(false), 500),
		next: () => {
			teller.misc.showSanta(false);
			teller.hands.moveLeftHand(true);
		}
	},
	{
		id: 3,
		type: 'default',
		text: get(format)('welcome.dialog3'),
		callbackDelay: 3000,
		callback: () => startTimelineStorage.requestButtonsVisible.set(true),
		next: () => startTimelineStorage.requestButtonsVisible.set(false)
	},
	{
		id: 4,
		type: 'default',
		text: get(format)('welcome.accept1'),
		callbackDelay: 1000,
		callback: () => {
			teller.eyes.open();
			tools.tellerNode?.continueTimeline();
		},
		before: () => teller.eyes.close(true)
	},
	{
		id: 5,
		type: 'default',
		text: get(format)('welcome.accept2'),
		callbackDelay: 3000,
		callback: () => {
			teller.eyes.close(false);
			tools.tellerNode?.continueTimeline();
		},
		next: () =>
			setTimeout(() => {
				teller.hands.moveLeftHand(false);
				teller.misc.showQuestion();
			}, 500)
	},
	{
		id: 6,
		type: 'formatted',
		text: get(format)('welcome.accept3'),
		callbackDelay: [1000, 1000, 4000],
		callback: (index?: number) => {
			switch (index) {
				case 0: {
					teller.hands.moveRightHand(false);
					teller.misc.showSearch();
					break;
				}
				case 1: {
					teller.misc.playCardAnimation();
					break;
				}
				case 2: {
					startTimelineStorage.showGenericButton(get(format)('welcome.buttons.soundsGood'));
					break;
				}
			}
		},
		next: () => teller.misc.endCardAnimation()
	},
	{
		id: 7,
		type: 'default',
		text: get(format)('welcome.start'),
		callbackDelay: 3000,
		callback: () => startTimelineStorage.showGenericButton(get(format)('welcome.buttons.letsGo')),
		next: () => {
			tools.textNode?.hide();
			setTimeout(teller.misc.playQuizStartAnimation, 1500);
		}
	},

	//reject frames
	{
		id: 1000,
		type: 'formatted',
		text: get(format)('welcome.reject1'),
		callbackDelay: [1000, 3000],
		callback: (index?: number) => {
			if (index === 1) {
				teller.eyes.open();
				tools?.tellerNode?.continueTimeline(1001);
			}
		},
		before: () => teller.eyes.close(false)
	},
	{
		id: 1001,
		type: 'default',
		text: get(format)('welcome.reject2'),
		callbackDelay: 2000,
		callback: () =>
			startTimelineStorage.showGenericButton(get(format)('welcome.buttons.changedMyMind'), 4)
	}
];
