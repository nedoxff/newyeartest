<script lang="ts">
	import { pickMatch } from '$lib/timelines/Questions';

	let analyzing = true;
	const MAX_VALUE: number = 511;
	const map: Map<string, number> = new Map<string, number>();

	const dec2bin = (num: number) => (num >>> 0).toString(2).padStart(9, '0');

	for (let curr = 0; curr <= MAX_VALUE; curr++) {
		const bin = dec2bin(curr);
		const arr = bin.split('').map((x) => parseInt(x));
		const match = pickMatch(arr);

		if (!map.has(match[0])) map.set(match[0], 1);
		else map.set(match[0], map.get(match[0])! + 1);
	}
	analyzing = false;
</script>

<div class="w-full h-[100dvh] p-4">
	{#if analyzing}
		<h1 class="text-white text-3xl">Analyzing...</h1>
	{:else}
		{#each map as e}
			<h1 class="text-white text-3xl">{e[0]} -> {e[1]}/512 ({((e[1] / 512) * 100).toFixed(2)}%)</h1>
		{/each}
	{/if}
</div>
