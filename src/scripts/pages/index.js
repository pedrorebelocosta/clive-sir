import $ from 'jquery';
import { createApi } from 'unsplash-js';

const AMOUNT_OF_PHOTOS = 30;
const COLLECTION_IDS = [158643];

const carousel = $('.carousel-inner');
const serverApi = createApi({
	accessKey: 'EhuHQ5DID6i0CSfEBICM3-hrxT1o7jZ9mTPuuQYZ7j0',
});

// unplash is limited to 50 requests per hour on demo environments
serverApi.photos.getRandom({ collectionIds: COLLECTION_IDS, count: AMOUNT_OF_PHOTOS }).then(
	(data) => {
		data.response.forEach((photo, idx) => {
			const newBg = `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
									<img class="d-block w-100"
										src="${photo.urls.full}"
										alt="${photo.description}">
								</div>`;
			carousel.append(newBg);
		});
	},
).catch(
	(error) => {
		const defaultBg = `<div class="carousel-item active">
								<img class="d-block w-100"
									src="../images/default-bg.jpg"
									alt="Escadório Bom Jesus Braga">
							</div>`;
		carousel.append(defaultBg);
		console.log(error);
	},
);
