<template>
	<div>
		<!-- можно сократить как  @selectCity-->
		<choose-city v-on:selectCity="getCity" />
		<weather-widget v-bind:nameCity="nameCity"/>
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
	},
};
</script>

<style src="@/assets/css/style.css"></style>
