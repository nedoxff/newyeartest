export function randomString() {
	const CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let res: string = '';
	for (let i = 0; i < 10; i++) res += CHARS[Math.floor(Math.random() * CHARS.length)];
	return res;
}

export function randomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}
