import type Teller from '../../ui/drawable/Teller.svelte';
import type AnimatedText from '../../ui/AnimatedText.svelte';

export type Timeline = () => TimelineFrame[];

export type TimelineFrame = {
	type: 'default' | 'formatted';
	text: string;
	id: number;
	callbackDelay: number | number[];
	callback?: (index?: number) => void;
	before?: () => void;
	next?: (index?: number) => void;
};

export type TimelineTools = {
	tellerNode?: Teller;
	textNode?: AnimatedText;
	currentTimeline?: Timeline;
	currentFrameIndex: number;
};

export function getCurrentFrame(): TimelineFrame | undefined {
	if (tools.currentTimeline === undefined || tools.currentFrameIndex === -1) {
		return undefined;
	}
	return tools.currentTimeline().find((v) => v.id == tools.currentFrameIndex);
}

export const tools: TimelineTools = { currentFrameIndex: -1 };
