import { tools, type Timeline } from '$lib/types/TimelineTypes';
import { get, writable, type Writable } from 'svelte/store';
import { format } from 'svelte-i18n';
import { teller } from '$lib/types/TellerAnimationsTypes';
import { profile, result, state, userid, username } from '$lib';
import { pickMatch } from './Questions';
import { AppState } from '$lib/types/AppState';
import { renderEmployeeCard } from '$lib/helpers/CardRenderer';

export const nameInputVisible: Writable<boolean> = writable(false);

export let resultTimeline: Timeline = () => [
	{
		id: 0,
		type: 'default',
		text: get(format)('intrigue.thanks'),
		callbackDelay: 2000,
		callback: () => {
			tools.tellerNode?.continueTimeline();
			teller.eyes?.close(false);
		}
	},
	{
		id: 1,
		type: 'default',
		text: get(format)('intrigue.pleaseEnterName'),
		callbackDelay: 2000,
		callback: () => {
			nameInputVisible.set(true);
		}
	},
	{
		id: 2,
		type: 'default',
		text: get(format)('intrigue.pleaseWait'),
		callbackDelay: 0,
		before: () => {
			result.set(pickMatch(profile));
			renderEmployeeCard(userid, get(username), get(format)(`jobs.${get(result)[0]}`)).then(() => {
				setTimeout(() => tools.tellerNode?.continueTimeline(get(result)[1] ? 5 : 3), 2000);
			});
		}
	},
	// interesting case
	{
		id: 3,
		type: 'default',
		text: get(format)('intrigue.interestingCase'),
		callbackDelay: 3000,
		before: () => teller.eyes?.open(),
		callback: () => {
			tools.tellerNode?.continueTimeline();
		}
	},
	{
		id: 4,
		type: 'default',
		text: get(format)('intrigue.interestingCase2'),
		callbackDelay: 3000,
		before: () => teller.eyes?.close(true),
		callback: () => {
			tools.tellerNode?.continueTimeline(6);
		}
	},
	// perfect match
	{
		id: 5,
		type: 'default',
		text: get(format)('intrigue.perfectMatch'),
		callbackDelay: 3000,
		before: () => teller.eyes?.close(true),
		callback: () => {
			tools.tellerNode?.continueTimeline();
		}
	},
	{
		id: 6,
		type: 'default',
		text: get(format)('intrigue.letsSeeCard'),
		callbackDelay: 3000,
		before: () => teller.eyes?.open(),
		callback: () => {
			state.set(AppState.Results);
		}
	}
];
