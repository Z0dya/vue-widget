// преобразование полученных данных с 2 API в числа
export function getNumbersFromString(string) {
	let numberPattern = /\d+/g; // регулярное выражение
	let numbers = string.match(numberPattern);
	return numbers;
}
