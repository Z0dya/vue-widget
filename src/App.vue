<template>
	<div @mousemove="moveTrigger">
		<!-- можно сократить как  @selectCity-->
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

<style src="@/assets/css/style.css"></style>
