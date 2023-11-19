<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { loaded, state } from '$lib';
	import { AppState } from '$lib/types/AppState';

	import { addMessages, init } from 'svelte-i18n';
	import en from '../locales/en.json';
	import ru from '../locales/ru.json';
	addMessages('en', en);
	addMessages('ru', ru);

	let initialLocale: string = 'ru';
	const params = new URLSearchParams(window.location.search);
	if (params.has('il') && params.get('il') !== null) initialLocale = params.get('il')!;
	init({
		fallbackLocale: 'ru',
		initialLocale: initialLocale
	});

	import LoadingContainer from '../ui/LoadingContainer.svelte';
	import WelcomeScreen from '../ui/WelcomeScreen.svelte';
	import Test from '../ui/drawable/Test.svelte';
	import IntrigueScreen from '../ui/IntrigueScreen.svelte';
	import ResultsScreen from '../ui/ResultsScreen.svelte';

	let appState: AppState;
	state.subscribe((v) => (appState = v));
</script>

{#if !$loaded}
	<LoadingContainer />
{:else if appState === AppState.Introduction}
	<div in:fly={{ delay: 1000, y: 5, opacity: 0 }}>
		<div in:fade={{ delay: 1000 }}>
			<WelcomeScreen />
		</div>
	</div>
{:else if appState === AppState.Acquaintance}
	<Test />
{:else if appState === AppState.Intrigue}
	<div in:fly={{ delay: 1000, y: 5, opacity: 0 }} out:fly={{ delay: 1000, y: 5, opacity: 0 }}>
		<div in:fade={{ delay: 1000 }}>
			<IntrigueScreen />
		</div>
	</div>
{:else if appState === AppState.Results}
	<ResultsScreen />
{/if}
