<template>
	<div class="area" v-on:mouseup="mouseUp">
		<!-- mouseUp - отпускаю мышь | mouseDown - когда 1 раз нажал на мышку  | mousemove - когда мышка двигается -->
		<div class="weatherBlock" ref="weatherBlock" v-on:mousedown="mouseDown">
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
		async nameCity() {
			this.capital = this.nameCity;
			await this.getWeather();
		},

		tempCount() {
			this.changeColor();
		},
		weatherIcon() {
			this.$refs.icon.src = this.weatherIcon;
		},
	},
	async mounted() {
		this.initial();
		this.changeColor();
		//обновление информации каждую минуту
		await setInterval(() => {
			this.getWeather();
		}, 60000);
	},
};
</script>

<style>
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

.area {
	display: flex;
	justify-content: center;
	height: 100vh;
}

.weatherBlock {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 5px solid transparent;
	background: linear-gradient(#c2d3e8, #c2d3e8, #dfb1d5, #dfb1d5) padding-box, radial-gradient(#00c9a7, #845ec2);
	width: 250px;
	height: 360px;
	border-radius: 10%;
	padding: 30px;
	text-align: center;
	margin: 10px;
	position: absolute;
	user-select: none;
	-webkit-user-select: none;
}

.cityName {
	background: linear-gradient(to right, #4776e6, #8e54e9);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	width: 100%;
	cursor: default;
	pointer-events: none;
}

.temp {
	width: 100%;
	background: linear-gradient(to right, #4776e6, #8e54e9);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-size: 22px;
	pointer-events: none;
}

.temp__count {
	font-size: 40px;
	margin: 0;
	cursor: default;
	pointer-events: none;
}

.temp__count::after {
	content: '°C';
	pointer-events: none;
}

.temp__description {
	cursor: default;
	pointer-events: none;
}

.temp__wind {
	cursor: default;
	pointer-events: none;
}

.weather__icon {
	width: 100%;
	margin: 0;
	pointer-events: none;
}

/* стили для разных температур */

.hot {
	/* background: #FFFFCC; */
	background: linear-gradient(#c2d3e8, #ffffcc, #ffffcc, #dfb1d5) padding-box, radial-gradient(#00c9a7, #845ec2);
}

.normal {
	/* background: #ffffffd6; */
	background: linear-gradient(#c2d3e8, #ffffff, #ffffff, #dfb1d5) padding-box, radial-gradient(#00c9a7, #845ec2);
}

.cold {
	/* background: #CCFFFF; */
	background: linear-gradient(#c2d3e8, #ccffff, #ccffff, #dfb1d5) padding-box, radial-gradient(#00c9a7, #845ec2);
}

/* стили тэгов */

hr {
	width: 100%;
	border: 0;
	height: 1px;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
	pointer-events: none;
}
</style>
