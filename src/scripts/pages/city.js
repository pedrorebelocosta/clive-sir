import $ from 'jquery';
import { createApi } from 'unsplash-js';
import { fromUnixTime, format } from 'date-fns';
import * as L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { UNSPLASH_API, TRIPMAP_API } from '../config/app-keys';

const carousel = $('#city-carousel');
const weatherCards = $('#weather-cards');
const lifeCards = $('#life-cards');
const unsplashApi = createApi({
	accessKey: UNSPLASH_API,
});

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

$(() => {
	if (sessionStorage.getItem('city') !== null) {
		// const fullCityName = sessionStorage.getItem('city');
		const selectedCity = sessionStorage.getItem('city').split(',')[0];
		let map;
		sessionStorage.clear();
		$('#city-name').text(selectedCity);

		unsplashApi.search.getPhotos(
			{ query: selectedCity },
		).then(
			(data) => {
				data.response.results.forEach((photo, idx) => {
					const elem = `<div class="carousel-item${idx === 0 ? ' active' : ''}">
								<img src="${photo.urls.full}"
									alt="${photo.description}"
									class="img-fluid">
							</div>`;
					carousel.append(elem);
				});
			},
		).catch(
			(error) => console.log(error),
		);

		fetch(`http://localhost:1234/weather?city=${selectedCity}`).then(
			(res) => res.json().then((data) => {
				map = L.map('map').setView([data.lat, data.lon], 15);

				const DefaultIcon = L.icon({
					iconUrl: icon,
					shadowUrl: iconShadow,
				});

				L.Marker.prototype.options.icon = DefaultIcon;
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				}).addTo(map);

				fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${data.lon}&lat=${data.lat}&limit=15&apikey=${TRIPMAP_API}`).then(
					(resp) => resp.json().then(
						(json) => {
							json.features.forEach((poi) => {
								L.marker([poi.geometry.coordinates[1], poi.geometry.coordinates[0]]).addTo(map)
									.bindPopup(`${poi.properties.name}`);
							});
						},
					),
				);

				let date = fromUnixTime(data.current.dt);
				let card = `<div class="col mb-4">
								<div class="card flex-row">
									<img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" class="card-img-top weather-icon">
									<div class="card-body">
										<div class="d-flex flex-wrap justify-content-between align-self-center align-content-center">
											<h5 class="card-title">${days[date.getDay()]}</h5>
											<p class="float-right text-muted">${format(date, 'dd/MM')}</p>
										</div>
										<p class="card-text"><b>${Math.round(data.current.temp)}ºC</b></p>
									</div>
								</div>
							</div>`;
				weatherCards.append(card);

				for (let i = 1; i < 3; i += 1) {
					date = fromUnixTime(data.daily[i].dt);
					card = `<div class="col mb-4">
								<div class="card flex-row">
									<img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" class="card-img-top weather-icon">
									<div class="card-body">
										<div class="d-flex flex-wrap justify-content-between align-self-center align-content-center">
											<h5 class="card-title">${days[date.getDay()]}</h5>
											<p class="float-right text-muted">${format(date, 'dd/MM')}</p>
										</div>
										<p class="card-text"><b>${Math.round(data.daily[i].temp.max)}ºC</b> / <span class="text-muted">${Math.round(data.daily[i].temp.min)}ºC</span></p>
									</div>
								</div>
							</div>`;
					weatherCards.append(card);
				}
			}),
		);
		fetch(`http://localhost:1234/city_quality?city=${selectedCity}`).then(
			(res) => res.json().then((data) => {
				let card = `<div class="col mb-4">
								<div class="card text-center">
									<div class="fontawesome-card-icon">
										<i class="far fa-smile-wink fa-5x"></i>
									</div>
									
									<div class="card-body">
										<h5 class="card-title">General Quality Index</h5>
										<p class="card-text">${Math.round(data.quality_of_life_index) || 'N/A'}</p>
									</div>
								</div>
							</div>`;
				lifeCards.append(card);
				card = `<div class="col mb-4">
							<div class="card text-center">
								<div class="fontawesome-card-icon">
									<i class="fas fa-mask fa-5x"></i>
								</div>
								
								<div class="card-body">
									<h5 class="card-title">Crime Index</h5>
									<p class="card-text">${Math.round(data.crime_index) || 'N/A'}</p>
								</div>
							</div>
						</div>`;
				lifeCards.append(card);

				card = `<div class="col mb-4">
							<div class="card text-center">
								<div class="fontawesome-card-icon">
									<i class="fas fa-money-bill-wave-alt fa-5x"></i>
								</div>
								
								<div class="card-body">
									<h5 class="card-title">Purchasing Power Index</h5>
									<p class="card-text">${Math.round(data.purchasing_power_incl_rent_index) || 'N/A'}</p>
								</div>
							</div>
						</div>`;
				lifeCards.append(card);
			}),
		);
	}
});
