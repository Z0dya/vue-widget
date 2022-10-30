<template>
	<div class="area">
		<div class="weatherBlock">
			<h1 class="cityName" ref="cityName">Название города</h1>
			<hr />
			<div class="temp">
				<p class="temp__count" ref="tempCount">0</p>
				<p class="temp__description" ref="tempDescription">Описание погоды</p>
				<p class="temp__wind" ref="tempWind">Скорость ветра м/с</p>
			</div>
			<hr />
			<p class="weather__icon">
				<img src="@/assets/img/02d@2x.png" alt="Картинка" ref="icon" ondragstart="return false;" />
			</p>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	props: {
		nameCity: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			//...
		};
	},
	methods: {
		async getWeather(capital) {
			let tempCount;
			let tempDescription;
			let weatherIcon;
			let tempWind;
			try {
				//!-------------------------1-API------------------------------//
				const response = await axios.get(
					`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=fb876a71a8844bf7dbd7aa9a8080a2e9`,
				);
				const data = response.data; //преобразование полученных данных в объект

				//? преобразование данных и запись в отдельные переменные
				tempCount = Math.round(data.main.temp - 273); //!!!!!!!!!!!!!!!!!!!
				tempDescription = data.weather[0].description;
				weatherIcon = `./img/${data.weather[0].icon}@2x.png`;
				tempWind = data.wind.speed + ' м/c';

				// //? запись в HTML теги, отформатированные данные
				this.$refs.cityName.textContent = capital;
				this.$refs.tempCount.textContent = tempCount;
				this.$refs.tempDescription.textContent = tempDescription;
				this.$refs.icon.src = weatherIcon;
				this.$refs.tempWind.innerHTML = tempWind;
			} catch (error) {
				console.log(error);
				alert(error);
			}
		},
	},
	watch: {
		nameCity() {
			this.getWeather(this.nameCity);
		},
	},
};
</script>

<style src="@/assets/css/weatherWidget.css"></style>
