<template>
	<div @mousemove="moveTrigger">
		<!-- можно сократить как  @selectCity-->
		<!-- selectCity это отправленное событие с помощью @emit из ChooseCity -->
		<choose-city v-on:selectCity="getCity" />
		<weather-widget v-bind:nameCity="nameCity" ref="weatherWidget" />
	</div>
</template>

<script>
import ChooseCity from './components/ChooseCity.vue';
import WeatherWidget from './components/WeatherWidget.vue';

export default {
	components: {
		WeatherWidget,
		ChooseCity,
	},

	data() {
		return {
			nameCity: '',
		};
	},

	methods: {
		//функции
		getCity(nameCity) {
			this.nameCity = nameCity;
		},
		moveTrigger(e) {
			this.$refs.weatherWidget.move(e);
		},
	},
};
</script>

<style>
#app {
	margin-top: 60px;
}

html {
	height: 100%;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
}

body {
	background: #cc95c0;
	/* fallback for old browsers */
	background: -webkit-linear-gradient(to right, #7aa1d2, #dbd4b4, #cc95c0);
	/* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to right, #7aa1d2, #dbd4b4, #cc95c0);
	/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	animation: gradient 10s ease-in infinite;
	background-size: 200%;
	overflow: hidden;
}

@keyframes gradient {
	0% {
		background-position: 0 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0 50%;
	}
}
</style>
