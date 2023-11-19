import { cubicOut } from 'svelte/easing';

export function fullFly(
	node: HTMLElement,
	{ delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}
) {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity * (1 - opacity);
	const [xValue, xUnit] = split_css_unit(x);
	const [yValue, yUnit] = split_css_unit(y);
	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => {
			return `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
            height: ${split_css_unit(style.height)[0] * (1 - t)}px
			opacity: ${target_opacity - od * u}`;
		}
	};
}

export function split_css_unit(value: string | number): [number, string] {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split
		? [parseFloat(split[1]), split[2] || 'px']
		: [typeof value === 'number' ? value : parseFloat(value), 'px'];
}
