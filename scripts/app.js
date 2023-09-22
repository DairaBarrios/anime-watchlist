const recommendations = {
	action: {
		netflix: {
			classic: 'Fullmetal Alchemist: Brotherhood',
			new: 'Attack on Titan',
		},
		crunchyroll: {
			classic: 'Naruto',
			new: 'Demon Slayer: Kimetsu no Yaiba',
		},
	},
	mystery: {
		netflix: {
			classic: 'Death Note',
			new: 'The Promised Neverland',
		},
		crunchyroll: {
			classic: 'Hyouka',
			new: 'Erased',
		},
	},
	adventure: {
		netflix: {
			classic: 'One Piece',
			new: 'Hunter x Hunter',
		},
		crunchyroll: {
			classic: 'Dragon Ball Z',
			new: 'My Hero Academia',
		},
	},
	comedy: {
		netflix: {
			classic: 'Great Teacher Onizuka',
			new: 'One Punch Man',
		},
		crunchyroll: {
			classic: 'Nichijou',
			new: 'Kaguya-sama: Love is War',
		},
	},
};

Vue.prototype.$recommendations = recommendations;

// AnimeWatchlist Component
Vue.component('anime-watchlist', {
	template: `
    <div>
      <h2>Anime Watchlist</h2>
      <ul v-if="watchlist.length > 0">
        <li v-for="anime in watchlist" :key="anime.name">
          {{ anime.name }} ({{ anime.watched ? 'Visto' : 'No visto' }}) - Recomendado: {{ anime.recomend ? 'Sí' : 'No' }}
          <button @click="toggleRecommend(anime)">Recomendar</button>
          <button @click="toggleWatched(anime)">Marcar como {{ anime.watched ? 'No visto' : 'Visto' }}</button>
          <button @click="startWritingReview(anime)">
            {{ anime.review ? 'Modificar Review' : 'Escribir Review' }}
          </button>
          <button @click="removeFromWatchlist(anime)">Eliminar</button>
          <div v-if="anime.writingReview">
            <textarea v-model="anime.review" rows="4" cols="50"></textarea>
            <button @click="saveReview(anime)">Guardar Review</button>
          </div>
          <p v-else-if="anime.review">Review: {{ anime.review }}</p>
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
        <select v-model="selectedGenre">
          <option value="action">Action</option>
          <option value="mystery">Mystery</option>
          <option value="adventure">Adventure</option>
          <option value="comedy">Comedy</option>
        </select>
        <button @click="nextStep">Next</button>
      </div>
      <div v-else-if="step === 2">
        <label>Select a streaming platform:</label>
        <select v-model="selectedPlatform">
          <option value="netflix">Netflix</option>
          <option value="crunchyroll">Crunchyroll</option>
        </select>
        <button @click="nextStep">Next</button>
      </div>
      <div v-else-if="step === 3">
        <label>Is it a classic or new anime?</label>
        <select v-model="selectedType">
          <option value="classic">Classic</option>
          <option value="new">New</option>
        </select>
        <button @click="nextStep">Next</button>
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
        <p>Hola {{ username }}! Te recomiendo {{ recommendation }}</p>
        <button @click="saveRecommendation">Save Recommendation</button>
      </div>
    </div>
  `,
	data() {
		return {
			step: 0,
			username: '',
			selectedGenre: '',
			selectedPlatform: '',
			selectedType: '',
			recommendation: '',
		};
	},
	methods: {
		nextStep() {
			this.step++;
		},
		showRecommendation() {
			// Dummy recommendations based on user input
			this.recommendation = this.$recommendations[this.selectedGenre][this.selectedPlatform][this.selectedType];
			this.step++;
		},
		saveRecommendation() {
			const animeName = this.recommendation

			// Obtener el array actual de localStorage o crear uno vacío
			const savedAnimes = JSON.parse(localStorage.getItem('savedAnimes')) || [];
			console.log(savedAnimes)

			console.log(savedAnimes)

			var animeExists = false;

			for (var savedAnime of savedAnimes) {
				console.log(savedAnime.name, animeName )
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
					"review": null
				}

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
