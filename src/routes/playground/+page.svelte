<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const table = document.querySelector('#table') as HTMLTableElement;
		for (const row of table.children) {
			for (const header of row.children) header.classList.add('border', 'border-slate-600');
			const columnName = (row.children[0] as HTMLHeadingElement).innerText;
			if (columnName === 'Соотношение ответов') {
				for (let i = 1; i < row.children.length; i++) {
					const result = calculate(i);
					const keys = Array.from(result.keys());
					(row.children[i] as HTMLHeadingElement).innerText = `${result.get(keys[0])}/${result.get(
						keys[1]
					)}`;
				}
			}
		}

		for (let i = 1; i < table.children.length - 1; i++) {
			(
				table.children[i].children[table.children[i].children.length - 1] as HTMLHeadingElement
			).innerText = calculateRow(i);
		}
	});

	const calculate = (idx: number) => {
		const result: Map<string, number> = new Map<string, number>();
		const table = document.querySelector('#table') as HTMLTableElement;
		for (const row of table.children) {
			const columnName = (row.children[0] as HTMLHeadingElement).innerText;
			if (columnName === 'Соотношение ответов' || columnName === 'Персонаж') continue;
			const text = (row.children[idx] as HTMLHeadingElement).innerText;
			if (!result.has(text)) result.set(text, 1);
			else result.set(text, result.get(text)! + 1);
		}
		return result;
	};

	const getRow = (idx: number) => {
		const table = document.querySelector('#table') as HTMLTableElement;
		const row = table.children[idx] as HTMLTableRowElement;
		const result = [];
		for (let i = 1; i < row.children.length - 1; i++)
			result.push((row.children[i] as HTMLHeadingElement).innerText);
		return result;
	};

	const calculateRow = (idx: number) => {
		const table = document.querySelector('#table') as HTMLTableElement;
		const row = getRow(idx);
		const others = [];
		for (let i = 1; i < table.children.length - 1; i++) {
			if (i == idx) continue;
			others.push(getRow(i));
		}
		const count = others.map((x) => x.filter((y) => !row.includes(y)).length);
		return count.join('/');
	};
</script>

<div class="w-full h-[100dvh] bg-white absolute left-0 top-0 p-3">
	<table
		lang="ru"
		class="border border-slate-500 break-words border-separate table-fixed w-3/4"
		id="table"
	>
		<tr>
			<th>Персонаж</th>
			<th>Интроверт/Экстраверт?</th>
			<th>Сделает сам (DIY)/пойдёт в магазин?</th>
			<th>Ответственный/Забывчивый?</th>
			<th>Мечтатель/Реалист?</th>
			<th>Импульсивный/Сдержанный?</th>
			<th>Креативный/Смышлёный?</th>
			<th>Болтливый/Молчаливый?</th>
			<th>Выносливый/Слабый?</th>
			<th>Воспитанный/Грубый?</th>
			<th class="text-red-500">Кол-во отличий</th>
		</tr>
		<tr>
			<th>Белый медведь</th>
			<th>Интроверт</th>
			<th>Пойдёт в магазин</th>
			<th>Ответственный</th>
			<th>Реалист</th>
			<th>Сдержанный</th>
			<th>Смышлёный</th>
			<th>Молчаливый</th>
			<th>Выносливый</th>
			<th>Грубый</th>
			<th></th>
		</tr>
		<tr>
			<th>Эльф</th>
			<th>Экстраверт</th>
			<th>Сделает сам</th>
			<th>Ответственный</th>
			<th>Мечтательный</th>
			<th>Сдержанный</th>
			<th>Креативный</th>
			<th>Болтливый</th>
			<th>Выносливый</th>
			<th>Воспитанный</th>
			<th></th>
		</tr>
		<tr>
			<th>Гринч</th>
			<th>Интроверт</th>
			<th>Пойдёт в магазин</th>
			<th>Забывчивый</th>
			<th>Реалист</th>
			<th>Импульсивный</th>
			<th>Смышлёный</th>
			<th>Болтливый</th>
			<th>Слабый</th>
			<th>Грубый</th>
			<th></th>
		</tr>
		<tr>
			<th>Рудольф</th>
			<th>Экстраверт</th>
			<th>Сделает сам</th>
			<th>Ответственный</th>
			<th>Реалист</th>
			<th>Импульсивный</th>
			<th>Смышлёный</th>
			<th>Болтливый</th>
			<th>Выносливый</th>
			<th>Воспитанный</th>
			<th></th>
		</tr>
		<tr>
			<th>Метель</th>
			<th>Интроверт</th>
			<th>Сделает сам</th>
			<th>Забывчивый</th>
			<th>Реалист</th>
			<th>Импульсивный</th>
			<th>Креативный</th>
			<th>Молчаливый</th>
			<th>Слабый</th>
			<th>Воспитанный</th>
			<th></th>
		</tr>
		<tr>
			<th>Имбирный пряник</th>
			<th>Интроверт</th>
			<th>Сделает сам</th>
			<th>Забывчивый</th>
			<th>Мечтательный</th>
			<th>Сдержанный</th>
			<th>Креативный</th>
			<th>Молчаливый</th>
			<th>Выносливый</th>
			<th>Воспитанный</th>
			<th></th>
		</tr>
		<tr>
			<th class="text-red-500">Соотношение ответов</th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
			<th></th>
		</tr>
	</table>
</div>
