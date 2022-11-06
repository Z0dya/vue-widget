<template>
	<div class="main">
		<h1>
			Погода в столицах мира <br />
			Здесь вы можете узнать погоду в разных городах по всей планете!
		</h1>
		<!-- v-model =  -->
		<select id="select" v-model="capital">
			<option value="unset">Выберите страну</option>
			<option v-bind:value="city.capital" v-for="city of cities" :key="city.id">{{ city.name }}</option>
		</select>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			capital: 'unset',
			//переменные
			cities: [],
			url: 'https://restcountries.com/v2/all?fields=name,capital',
		};
	},

	methods: {
		//? функция получения api стран и столиц
		async getOptions() {
			try {
				const response = await axios.get(this.url);
				this.cities = response.data;
			} catch (error) {
				// если произошла ошибка, то выводим:
				console.log(error);
				alert(error);
			}
		},

		//сохранение выбранного города
		initial() {
			// при перезагрузке страницы сохранение выбранного города
			const data = JSON.parse(sessionStorage.getItem('weather')); // конвертирование в объект
			// присваивание переменной | capital ='unset' | значение выбранной столицы из session storage 
			this.capital = data.capital;
		},
	},
	watch: {
		// функция  в котором пишем событие отправки выбранного города (страны) в App
		capital() {
			this.$emit('selectCity', this.capital);
		},
	},
	// хук жизненного цикла после рендера страницы
	async mounted() {
		await this.getOptions();
		this.initial();
	},
	
};
</script>

<style scoped>
.main {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

select {
	margin: 20px;
	font-family: 'Open Sans', 'Helvetica Neue', 'Segoe UI', 'Calibri', 'Arial', sans-serif;
	font-size: 18px;
	color: #222;
	padding: 5px 0;
}

option {
	text-align: center;
	font-family: 'Open Sans', 'Helvetica Neue', 'Segoe UI', 'Calibri', 'Arial', sans-serif;
	font-size: 18px;
}

h1,
h2 {
	font-size: 24px;
	width: 50%;
	text-align: center;
	margin: 10px 0;
	background: linear-gradient(to right, #4776e6, #8e54e9);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: gradient 10s ease-in infinite;
	background-size: 200%;
}
</style>
