<script lang="ts">
	import { addMessages, init, _ } from 'svelte-i18n';
	import en from '../../locales/en.json';
	import ru from '../../locales/ru.json';
	import LanguageSwitcher from '../../ui/LanguageSwitcher.svelte';
	import WorkerCard from '../../ui/drawable/WorkerCard.svelte';
	import { randomString } from '$lib/helpers/RandomHelpers';
	addMessages('en', en);
	addMessages('ru', ru);
	init({
		fallbackLocale: 'ru',
		initialLocale: 'en'
	});

	let id: string = '';
	let name: string = 'placeholder';
	let job: string = 'gift giver';
</script>

<div class="w-full h-[100dvh] p-2 flex flex-col">
	<h1 class="text-white text-2xl mb-1">Card generator</h1>
	<hr />
	<div class="mt-2" id="card-generator">
		<div class="mb-2">
			<label
				for="default-input"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label
			>
			<input
				type="text"
				id="default-input"
				bind:value={name}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
		</div>
		<div class="mb-2">
			<label for="job" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Job</label
			>
			<textarea
				id="job"
				rows="4"
				class="block p-2.5 w-full lg:w-1/6 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder=""
				bind:value={job}
			></textarea>
		</div>
		<LanguageSwitcher />
		<button
			type="button"
			on:click={() => (id = randomString())}
			class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Generate</button
		>
		<h1 class="mt-2 text-white">{id === '' ? '' : 'Worker ID: '}{id}</h1>
		<div class="w-1/3">
			<WorkerCard onRevealed={() => {}} {id} {job} {name} />
		</div>
	</div>
</div>
