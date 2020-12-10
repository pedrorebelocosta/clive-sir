import $ from 'jquery';
import { createApi } from 'unsplash-js';
import { UNSPLASH_API } from '../config/app-keys';

const AMOUNT_OF_PHOTOS = 30;
const COLLECTION_IDS = [158643];
const carousel = $('#search-carousel');
const serverApi = createApi({
	accessKey: UNSPLASH_API,
});

$(() => {
	// unplash is limited to 50 requests per hour on demo environments
	serverApi.photos.getRandom({ collectionIds: COLLECTION_IDS, count: AMOUNT_OF_PHOTOS }).then(
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

	$('#searchTerm').on('keydown', (e) => {
		e.preventDefault();
	});

	$('#searchButton').on('click', (e) => {
		e.preventDefault();
		// https://www.numbeo.com/common/CitySearchJson?term=${term}
	});
});
