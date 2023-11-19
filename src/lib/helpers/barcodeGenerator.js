// @ts-nocheck
// this isn't a typescript file because the bwip-js type definitions lack a "columns" field in RenderOptions
// which, when included anyway, refuses to call the function
import { pdf417compact } from 'bwip-js/browser';
export function generateCompactBarcode(text, scale, columns) {
	const canvas = document.createElement('canvas');
	pdf417compact(canvas, {
		bcid: 'pdf417compact',
		text: text,
		columns: columns,
		scale: scale
	});
	const data = canvas.toDataURL('image/png');
	return data;
}
