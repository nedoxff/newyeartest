/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontFamily: {
			sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
			emoji: 'MozillaTwemoji'
		}
	},
	safelist: ['text-2xl', 'text-3xl', 'text-center', 'text-left', 'justify-center', 'justify-start'],
	plugins: []
};
