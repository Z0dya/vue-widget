<template>
	<div class="area" v-on:mouseup="mouseUp">
		<!-- mouseUp - отпускаю мышь | mouseDown - когда 1 раз нажал на мышку  | mousemove - когда мышка двигается -->
		<div class="weatherBlock" ref="weatherBlock" v-on:mousedown="mouseDown" @mousemove="move">
			<h1 class="cityName" ref="cityName">{{ capital }}</h1>
			<hr />
			<div class="temp">
				<p class="temp__count" ref="tempCount">{{ tempCount }}</p>
				<p class="temp__description" ref="tempDescription">{{ tempDescription }}</p>
				<p class="temp__wind" ref="tempWind">{{ tempWind }} м/с</p>
			</div>
			<hr />
			<p class="weather__icon">
				<img src="/img/02d@2x.png" alt="Картинка" ref="icon" ondragstart="return false;" />
			</p>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { getNumbersFromString } from '../utils/getNumbersFromString';

export default {
	props: {
		nameCity: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			// должен ли двигатся ли виджет
			moveActive: false,
			// координаты мыши относительно виджета
			mouseCoordinates: {
				offsetY: 0,
				offsetX: 0,
			},
			// переменные для записи данных в HTML
			capital: 'Город',
			tempCount: 20,
			tempDescription: 'Описание',
			weatherIcon: '/img/02d@2x.png',
			tempWind: '0',
		};
	},

	methods: {
		// функция заполнения HTML тэгов полученными данными с API
		async getWeather() {
			try {
				try {
					//!-------------------------1-API------------------------------//

					// для прерывания запроса через время
					let controller = new AbortController();
					setTimeout(() => {
						controller.abort();
					}, 3000);

					const response = await axios.get(
						`https://api.openweathermap.org/data/2.5/weather?q=${this.capital}&appid=fb876a71a8844bf7dbd7aa9a8080a2e9`,
						{
							signal: controller.signal,
						},
					);
					const data = response.data; // из объекта response забираем data (короткая запись)

					//? преобразование данных и запись в отдельные переменные
					this.tempCount = Math.round(data.main.temp - 273); //!!!!!!!!!!!!!!!!!!!
					this.tempDescription = data.weather[0].description;
					this.weatherIcon = `./img/${data.weather[0].icon}@2x.png`;
					this.tempWind = data.wind.speed;
					//!-------------------------2-API------------------------------//
				} catch {
					const response = await axios.get(`https://goweather.herokuapp.com/weather/${this.capital}`);
					const data = response.data; // из объекта response забираем data (короткая запись)

					this.tempCount = Math.round(getNumbersFromString(data.temperature));
					this.tempDescription = data.description;
					this.weatherIcon = `./img/temperatureicon.png`;
					this.tempWind = Math.round(getNumbersFromString(data.wind) / 3.6);
				}

				//!-------------------Блок сохранения [sessionStorage]---------------//
				//? создание объекта куда записывается вся инфа
				const savedData = {
					capital: this.capital,
					tempCount: this.tempCount,
					tempDescription: this.tempDescription,
					weatherIcon: this.weatherIcon,
					tempWind: this.tempWind,
				};
				//? конвертирование объекта в строку и запись в sessionStorage
				sessionStorage.setItem('weather', JSON.stringify(savedData));
				//!---------------------------------------------------------------//
			} catch (error) {
				console.log(error);
				alert(error);
			}
		},
		//session storage
		initial() {
			const data = JSON.parse(sessionStorage.getItem('weather')); // конвертирование в объект
			if (data) {
				//если data !null то делаем:
				this.capital = data.capital;
				this.tempCount = data.tempCount;
				this.tempDescription = data.tempDescription;
				this.weatherIcon = data.weatherIcon;
				this.tempWind = data.tempWind;
			}

			//? чтение данных какие были координаты до перезагрузки страницы
			const movingData = JSON.parse(sessionStorage.getItem('position')); //конвертируем в объект
			let widget = this.$refs.weatherBlock;
			if (movingData) {
				//если не null то перемещаем виджет на координаты:
				widget.style.top = movingData.Y;
				widget.style.left = movingData.X;
			}
		},

		//условие изменения фона виджета в зависимости от температуры
		changeColor() {
			this.$refs.weatherBlock.classList.remove('hot', 'cold', 'normal');
			if (this.tempCount > 0 && this.tempCount <= 20) {
				this.$refs.weatherBlock.classList.add('normal');
			} else if (this.tempCount < 0) {
				this.$refs.weatherBlock.classList.add('cold');
			} else if (this.tempCount > 20) {
				this.$refs.weatherBlock.classList.add('hot');
			}
		},
		//!-------------------*Блок перемещения виджета---------------//

		mouseDown(e) {
			// вычисляем координаты
			this.mouseCoordinates.offsetY = e.pageY - e.target.offsetTop;
			this.mouseCoordinates.offsetX = e.pageX - e.target.offsetLeft;
			this.moveActive = true;
		},

		mouseUp() {
			this.moveActive = false;
			const movingData = {
				X: this.$refs.weatherBlock.style.left,
				Y: this.$refs.weatherBlock.style.top,
			};
			//? конвертирование объекта в строку и запись в sessionStorage
			sessionStorage.setItem('position', JSON.stringify(movingData));
		},

		move(e) {
			if (this.moveActive) {
				// page координаты мыши относительно левого верхнего угла экрана
				this.$refs.weatherBlock.style.top = e.pageY - this.mouseCoordinates.offsetY + 'px';
				this.$refs.weatherBlock.style.left = e.pageX - this.mouseCoordinates.offsetX + 'px';
			}
		},
	},
	watch: {
		// watch следит за изменением переменных
		nameCity() {
			this.capital = this.nameCity;
			this.getWeather();
		},

		tempCount() {
			this.changeColor();
		},
		weatherIcon() {
			this.$refs.icon.src = this.weatherIcon;
		},
	},
	mounted() {
		this.initial();
		this.changeColor();
		//обновление информации каждую минуту
		setInterval(() => {
			this.getWeather();
		}, 60000);
	},
};
</script>

<style src="@/assets/css/weatherWidget.css"></style>
