<script lang="ts">
	import { onMount } from 'svelte';
	import { randomInt } from '$lib/helpers/RandomHelpers';
	import anime from 'animejs';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let globalOpacity: number;

	const FADE_IN_TRANSITION_LENGTH: number = 3000;
	const LONG_ANIMATION_LENGTH: number = 10000;
	const ORB_SPREAD: number = 1.25;

	type Orb = {
		x: number;
		y: number;
		color: string;
		intensity: number;
		blur: number;
	};
	let orbs: Map<string, Orb> = new Map<string, Orb>();

	export function setGlobalOpacity(opacity: number) {
		globalOpacity = opacity;
	}

	export function addOrb(id: string, color: string, intensity: number, blur: number) {
		orbs.set(id, {
			color: color,
			intensity: intensity,
			blur: blur,
			x: 0,
			y: 0
		});
		anime({
			targets: orbs.get(id),
			intensity: [0, intensity],
			duration: FADE_IN_TRANSITION_LENGTH,
			easing: 'easeInOutQuad'
		});
		anime({
			targets: orbs.get(id),
			x: [
				0,
				randomInt(0, 1) == 0 ? randomInt(-25 * ORB_SPREAD, -10) : randomInt(10, 25 * ORB_SPREAD)
			],
			y: [
				0,
				randomInt(0, 1) == 0 ? randomInt(-25 * ORB_SPREAD, -10) : randomInt(10, 25 * ORB_SPREAD)
			],
			delay: FADE_IN_TRANSITION_LENGTH / 2,
			duration: FADE_IN_TRANSITION_LENGTH / 2,
			easing: 'easeInOutQuad'
		});

		setTimeout(() => {
			setInterval(() => animate(id), LONG_ANIMATION_LENGTH);
			animate(id);
		}, FADE_IN_TRANSITION_LENGTH);
	}

	function animate(id: string) {
		const orb = orbs.get(id);
		anime({
			targets: orb,
			x: randomInt(-25 * ORB_SPREAD, 25 * ORB_SPREAD),
			y: randomInt(-25 * ORB_SPREAD, 25 * ORB_SPREAD),
			intensity: randomInt(25, 50),
			blur: randomInt(50, 75),
			duration: LONG_ANIMATION_LENGTH,
			easing: 'easeInOutQuad'
		});
	}

	function draw() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.globalAlpha = globalOpacity;
		for (const [, orb] of orbs) {
			ctx.save();
			const boxSize = 5;
			const x = canvas.width / 2 - boxSize;
			const y = canvas.height / 2 - boxSize;
			const scaleFactor = (2 * orb.intensity + boxSize) / boxSize;
			ctx.scale(scaleFactor, scaleFactor);
			ctx.shadowColor = orb.color;
			ctx.shadowBlur = orb.blur;
			ctx.shadowOffsetX = orb.x + canvas.width;
			ctx.shadowOffsetY = orb.y + canvas.height;
			ctx.fillRect(
				(x - orb.intensity - canvas.width) / scaleFactor,
				(y - orb.intensity - canvas.height) / scaleFactor,
				boxSize,
				boxSize
			);
			ctx.restore();
		}

		window.requestAnimationFrame(draw);
	}

	function onWindowResized() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		draw();
	}

	onMount(() => {
		canvas = document.querySelector('#orb-bg')!;
		ctx = canvas.getContext('2d')!;
		onWindowResized();
	});
</script>

<svelte:window on:resize={onWindowResized} />
<canvas class="w-full h-[100dvh] absolute top-0 left-0" id="orb-bg"></canvas>
