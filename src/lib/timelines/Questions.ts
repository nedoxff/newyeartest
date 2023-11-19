import type { Question } from '$lib/types/TestTypes';
import { get } from 'svelte/store';
import { format } from 'svelte-i18n';
import { profile } from '$lib';

const QUESTION_COUNT: number = 9;

export function getQuestions(): Question[] {
	const result = [];
	for (let i = 0; i < QUESTION_COUNT; i++) {
		result.push({
			text: get(format)(`test.${i + 1}.text`),
			answer1: get(format)(`test.${i + 1}.answer1`),
			answer2: get(format)(`test.${i + 1}.answer2`),
			delay: 3000
		});
	}
	return result;
}

let firstColors: string[] = [
	'#2a9d8f',
	'#f2cc8f',
	'#ef233c',
	'#5f0f40',
	'#a4161a',
	'#0353a4',
	'#eed7c5',
	'#87bba2',
	'#f4f1bb'
];
let secondColors: string[] = [
	'#f4a261',
	'#81b29a',
	'#8d99ae',
	'#fb8b24',
	'#d3d3d3',
	'#5c677d',
	'#c89f9c',
	'#3b6064',
	'#ed6a5a'
];
export let colors: string[][] = [firstColors, secondColors];

export const characters: Map<string, number[]> = new Map<string, number[]>([
	['polarBear', [0, 1, 0, 1, 1, 1, 1, 0, 1]],
	['elf', [1, 0, 0, 0, 1, 0, 0, 0, 0]],
	['grinch', [0, 1, 1, 1, 0, 1, 0, 1, 1]],
	['rudolf', [1, 0, 0, 1, 0, 1, 0, 0, 0]],
	['blizzard', [0, 0, 1, 1, 0, 0, 1, 1, 0]],
	['gingerman', [0, 0, 1, 0, 1, 0, 1, 0, 0]]
]);

export function pickMatch(): [string, boolean] {
	if (profile.length !== QUESTION_COUNT)
		throw new Error(
			`Invalid profile array passed to pickMatch (length should be ${QUESTION_COUNT}, got ${profile.length})`
		);

	console.log(`user profile: ${profile}`);
	const entries = Array.from(characters.entries());

	const perfectMatch = entries.find((e) => JSON.stringify(e[1]) === JSON.stringify(profile));
	if (perfectMatch != null) {
		console.log(`found a perfect match: ${perfectMatch[0]}`);
		return [perfectMatch[0], true];
	}

	// it is 3 in the morning
	const sum = (first: number[], second: number[]) => {
		if (first.length !== second.length) throw new Error('length of compares arrays must be equal');
		let count = 0;
		for (let i = 0; i < first.length; i++) if (first[i] !== second[i]) count++;
		return count;
	};

	const differences = entries.map((x) => sum(x[1], profile));
	console.log(`differences array: ${differences}`);
	const index = differences.indexOf(Math.min(...differences));
	const closestMatch = entries.map((x) => x[0])[index];
	console.log(`closest match is ${closestMatch}`);

	return [closestMatch, false];
}
