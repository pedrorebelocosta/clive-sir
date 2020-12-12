import $ from 'jquery';
import { createApi } from 'unsplash-js';
import autocomplete from 'autocompleter';
import { UNSPLASH_API } from '../config/app-keys';

const LANDSCAPE = 'landscape';
const AMOUNT_OF_BG_PHOTOS = 30;
const COLLECTION_IDS = [158643];
const carousel = $('#search-carousel');
const serverApi = createApi({
	accessKey: UNSPLASH_API,
});

$(() => {
	if (document.getElementById('searchTerm') !== null) {
		const searchTerm = document.getElementById('searchTerm');
		let hasSelectedValidItem = false;

		serverApi.photos.getRandom(
			{ collectionIds: COLLECTION_IDS, count: AMOUNT_OF_BG_PHOTOS, orientation: LANDSCAPE },
		).then(
			(data) => {
				data.response.forEach((photo, idx) => {
					const newBg = `<div class="carousel-item${idx === 0 ? ' active' : ''}">
								<img class="img-fluid"
									src="${photo.urls.full}"
									alt="${photo.description}">
							</div>`;
					carousel.append(newBg);
				});
			},
		).catch(
			(error) => {
				const defaultBg = `<div class="carousel-item active">
								<img class="img-fluid"
									src="../images/default-bg.jpg"
									alt="Escadório Bom Jesus Braga">
							</div>`;
				carousel.append(defaultBg);
				console.log(error);
			},
		);

		autocomplete({
			input: searchTerm,
			debounceWaitMs: 1500,
			fetch: (text, update) => {
				const search = text.toLowerCase();
				fetch(`https://www.numbeo.com/common/CitySearchJson?term=${search}`).then(
					(res) => res.json().then((data) => update(data)),
				);
			},
			onSelect: (item) => {
				searchTerm.value = item.label;
				hasSelectedValidItem = true;
			},
		});

		$('#searchButton').on('click', (e) => {
			e.preventDefault();
			if (hasSelectedValidItem) {
				sessionStorage.setItem('city', searchTerm.value.trim());
				const { href } = window.location;
				const dir = `${window.location.href.substring(0, href.lastIndexOf('/'))}`;
				window.open(`${dir}/city.html`, '_self');
			}
		});
	}
});
