const recommendations = {
	action: {
		netflix: {
			classic: {
				name: 'Fullmetal Alchemist: Brotherhood',
				img: 'https://example.com/images/fullmetal_alchemist_brotherhood.jpg'
			},
			new: {
				name: 'Attack on Titan',
				img: 'https://example.com/images/attack_on_titan.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Naruto',
				img: 'https://cdn.myanimelist.net/images/anime/1565/111305.jpg'
			},
			new: {
				name: 'Demon Slayer: Kimetsu no Yaiba',
				img: 'https://example.com/images/demon_slayer.jpg'
			}
		}
	},
	mystery: {
		netflix: {
			classic: {
				name: 'Death Note',
				img: 'https://example.com/images/death_note.jpg'
			},
			new: {
				name: 'The Promised Neverland',
				img: 'https://example.com/images/the_promised_neverland.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Hyouka',
				img: 'https://example.com/images/hyouka.jpg'
			},
			new: {
				name: 'Erased',
				img: 'https://example.com/images/erased.jpg'
			}
		}
	},
	adventure: {
		netflix: {
			classic: {
				name: 'One Piece',
				img: 'https://example.com/images/one_piece.jpg'
			},
			new: {
				name: 'Hunter x Hunter',
				img: 'https://example.com/images/hunter_x_hunter.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Dragon Ball Z',
				img: 'https://example.com/images/dragon_ball_z.jpg'
			},
			new: {
				name: 'My Hero Academia',
				img: 'https://example.com/images/my_hero_academia.jpg'
			}
		}
	},
	comedy: {
		netflix: {
			classic: {
				name: 'Great Teacher Onizuka',
				img: 'https://example.com/images/great_teacher_onizuka.jpg'
			},
			new: {
				name: 'One Punch Man',
				img: 'https://example.com/images/one_punch_man.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Nichijou',
				img: 'https://example.com/images/nichijou.jpg'
			},
			new: {
				name: 'Kaguya-sama: Love is War',
				img: 'https://example.com/images/kaguya_sama.jpg'
			}
		}
	}
};


Vue.prototype.$recommendations = recommendations;

// AnimeWatchlist Component
Vue.component('anime-watchlist', {
	template: `
    <div>
      <h2>Anime Watchlist</h2>
      <ul v-if="watchlist.length > 0">
        <li v-for="anime in watchlist" :key="anime.name">
          <div>
            <img :src="getAnimeImage(anime)" alt="Anime Image" style="max-width: 100px;" />
            {{ anime.name }} ({{ anime.watched ? 'Visto' : 'No visto' }}) - 
            <span v-if="anime.recomend !== null">Recomendado: {{ anime.recomend ? 'Sí' : 'No' }}</span>
            <button v-if="anime.watched" @click="toggleRecommend(anime)">Recomendar</button>
            <button @click="toggleWatched(anime)">Marcar como {{ anime.watched ? 'No visto' : 'Visto' }}</button>
            <button v-if="anime.watched" @click="startWritingReview(anime)">
              {{ anime.review ? 'Modificar Review' : 'Escribir Review' }}
            </button>
            <button @click="removeFromWatchlist(anime)">Eliminar</button>
            <div v-if="anime.writingReview">
              <textarea v-model="anime.review" rows="4" cols="50"></textarea>
              <button @click="saveReview(anime)">Guardar Review</button>
            </div>
            <p v-else-if="anime.review">Review: {{ anime.review }}</p>
          </div>
        </li>
      </ul>
      <p v-else>No hay animes pendientes en la watchlist.</p>
    </div>
  `,
	data() {
		return {
			watchlist: [],
		};
	},
	mounted() {
		this.loadWatchlist();
	},
	methods: {
		loadWatchlist() {
			const savedAnimes = JSON.parse(localStorage.getItem('savedAnimes')) || [];
			this.watchlist = savedAnimes;
		},
		saveWatchlist() {
			localStorage.setItem('savedAnimes', JSON.stringify(this.watchlist));
		},
		toggleRecommend(anime) {
			anime.recomend = !anime.recomend;
			this.saveWatchlist();
		},
		toggleWatched(anime) {
			anime.watched = !anime.watched;

			// If the anime is marked as not watched, set recommendation status to null
			if (!anime.watched) {
				anime.recomend = null;
				anime.review = null;
			}
			this.saveWatchlist();
		},
		startWritingReview(anime) {
			anime.writingReview = true;
		},
		saveReview(anime) {
			anime.writingReview = false;
			this.saveWatchlist();
		},
		removeFromWatchlist(anime) {
			const index = this.watchlist.indexOf(anime);
			if (index !== -1) {
				this.watchlist.splice(index, 1);
				this.saveWatchlist();
			}
		},
		getAnimeImage(anime) {
			return anime.img
		}
	},
});

// AnimeTest Component
Vue.component('anime-test', {
	template: `
    <div>
      <h2>Anime Recommendation Test</h2>
      <div v-if="step === 0">
        <label for="username">Enter your name:</label>
        <input id="username" v-model="username" />
        <button @click="nextStep">Next</button>
      </div>
      <div v-else-if="step === 1">
        <label>Select a genre:</label>
        <button v-for="genre in genres" :key="genre" @click="selectGenre(genre)">{{ genre }}</button>
      </div>
      <div v-else-if="step === 2">
        <label>Select a streaming platform:</label>
        <button v-for="platform in platforms" :key="platform" @click="selectPlatform(platform)">{{ platform }}</button>
      </div>
      <div v-else-if="step === 3">
        <label>Is it a classic or new anime?</label>
        <button v-for="type in types" :key="type" @click="selectType(type)">{{ type }}</button>
      </div>
      <div v-else-if="step === 4">
        <h3>Confirmation:</h3>
        <p>Name: {{ username }}</p>
        <p>Genre: {{ selectedGenre }}</p>
        <p>Platform: {{ selectedPlatform }}</p>
        <p>Type: {{ selectedType }}</p>
        <button @click="showRecommendation">Confirm</button>
      </div>
      <div v-else-if="step === 5">
        <h3>Recommendation:</h3>
        <p>Hola {{ username }}! Te recomiendo {{ recommendation.name }}</p>
        <button @click="saveRecommendation">Save Recommendation</button>
      </div>
    </div>
  `,
	data() {
		return {
			step: 0,
			username: '',
			genres: ['Action', 'Mystery', 'Adventure', 'Comedy'],
			selectedGenre: '',
			platforms: ['Netflix', 'Crunchyroll'],
			selectedPlatform: '',
			types: ['Classic', 'New'],
			selectedType: '',
			recommendation: '',
		};
	},
	methods: {
		nextStep() {
			this.step++;
		},
		selectGenre(genre) {
			this.selectedGenre = genre;
			this.nextStep();
		},
		selectPlatform(platform) {
			this.selectedPlatform = platform;
			this.nextStep();
		},
		selectType(type) {
			this.selectedType = type;
			this.nextStep();
		},
		showRecommendation() {
			// Dummy recommendations based on user input
			this.recommendation = this.$recommendations[this.selectedGenre.toLowerCase()][this.selectedPlatform.toLowerCase()][this.selectedType.toLowerCase()];
			this.step++;
		},
		saveRecommendation() {
			const animeName = this.recommendation.name;

			// Obtener el array actual de localStorage o crear uno vacío
			const savedAnimes = JSON.parse(localStorage.getItem('savedAnimes')) || [];
			console.log(savedAnimes);

			var animeExists = false;

			for (var savedAnime of savedAnimes) {
				console.log(savedAnime.name, animeName);
				if (savedAnime.name == animeName) {
					animeExists = true;
					break;
				}
			}

			if (!animeExists) {
				// Agregar el anime al array

				var animeToSave = {
					"name": animeName,
					"watched": false,
					"recomend": null,
					"review": null,
					"img": this.recommendation.img
				};

				savedAnimes.push(animeToSave);

				// Guardar el array actualizado en localStorage
				localStorage.setItem('savedAnimes', JSON.stringify(savedAnimes));
			}
			this.$emit('recommendation-saved');
		},
	},
});


// App Component
const App = {
	template: `
        <div>
            <button @click="currentComponent = 'anime-watchlist'">Anime Watchlist</button>
            <button @click="currentComponent = 'anime-test'">Anime Test</button>
            <component :is="currentComponent" @recommendation-saved="switchToWatchlist" />
        </div>
    `,
	data() {
		return {
			currentComponent: null,
		};
	},
	methods: {
		switchToWatchlist() {
			this.currentComponent = "anime-watchlist";
		}
	}
};

new Vue({
	el: '#app',
	render: h => h(App),
});
