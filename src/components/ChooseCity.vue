<template>
	<div class="main">
		<h1>
			Погода в столицах мира <br />
			Здесь вы можете узнать погоду в разных городах по всей планете!
		</h1>
		<select id="select" ref="select" v-on:change="changeCity">
			<option value="unset">Выберите страну</option>
			<!-- <option  v-for="option of options" :key="option.id"></option> -->
			<option v-bind:value="city.capital" v-for="city of cities" :key="city.id">{{ city.name }}</option>
		</select>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
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
		// функция  в котором пишем событие отправки выбранного города (страны) в App
		changeCity(event) {
			this.$emit('selectCity', event.target.value);
		},
		//сохранение выбранного города
		initial() {
			const data = JSON.parse(sessionStorage.getItem('weather')); // конвертирование в объект

			if (data) {
				//если data !null то делаем:
				const options = document.querySelectorAll('option'); //поиск по всем option'am
				for (let option of options) {
					option.selected = false; //по дефолту не будет выбранного option'a
					if (option.value === data.capital) {
						//если value(город) содержит такой же город, то выделяем option как выбранный
						option.selected = true;
					}
				}
			}
		},
	},
	// хук жизненного цикла после рендера страницы
	mounted() {
		this.getOptions();
	},
	// при перезагрузке страницы сохранение выбранного города
	updated() {
		this.initial();
	},
};
</script>

<style scoped src="@/assets/css/chooseCity.css"></style>
