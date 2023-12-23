<script lang="ts">
	import { onMount } from 'svelte';
	import { locale, locales } from 'svelte-i18n';
	import classes from 'svelte-transition-classes';
	let opened: boolean = false;
	let flags: Record<string, string> = { ru: '🇷🇺', en: '🇬🇧' };

	function switchTo(lang: string) {
		$locale = lang;
		opened = false;
	}
	onMount(() => {
		if (!$locales.includes($locale ?? '')) $locale = 'ru'; // just in case
	});
</script>

<div class="relative inline-block text-left">
	<div>
		<button
			type="button"
			on:click={() => (opened = !opened)}
			class="inline-flex w-full justify-center items-center rounded-full bg-white px-3 py-2 text-base text-gray-900 shadow-sm hover:bg-gray-50"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			<span class="font-emoji mr-1">{flags[$locale ?? '']}</span>
			{$locale}
			<svg
				class="-mr-1 h-5 w-5 text-gray-400"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>
	{#if opened}
		<div
			in:classes={{
				duration: 100,
				base: 'transition ease-out duration-100',
				from: 'transform opacity-0 scale-95',
				to: 'transform opacity-100 scale-100'
			}}
			out:classes={{
				duration: 75,
				base: 'transition ease-in duration-75',
				from: 'transform opacity-100 scale-100',
				to: 'transform opacity-0 scale-95'
			}}
			class="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="py-1" role="none">
				<button
					on:click={() => switchTo('ru')}
					class="text-gray-700 block px-4 py-2 text-sm"
					role="menuitem"
					tabindex="-1"
					id="menu-item-0"><span class="font-emoji mr-1">{flags['ru']}</span> ru</button
				>
				<button
					on:click={() => switchTo('en')}
					class="text-gray-700 block px-4 py-2 text-sm"
					role="menuitem"
					tabindex="-1"
					id="menu-item-1"><span class="font-emoji mr-1">{flags['en']}</span> en</button
				>
			</div>
		</div>
	{/if}
</div>
