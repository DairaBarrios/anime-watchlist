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
      <ul>
        <li v-for="anime in watchlist" :key="anime.id">
          {{ anime.title }} ({{ anime.status }})
        </li>
      </ul>
    </div>
  `,
	data() {
		return {
			watchlist: [
				{ id: 1, title: 'Naruto', status: 'Not watched' },
				{ id: 2, title: 'Attack on Titan', status: 'Watched' },
				{ id: 3, title: 'One Piece', status: 'Not watched' },
				// ... más animes
			],
		};
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
			const animeName = recommendations[this.selectedGenre][this.selectedPlatform][this.selectedType];

			// Obtener el array actual de localStorage o crear uno vacío
			const savedAnimes = JSON.parse(localStorage.getItem('savedAnimes')) || [];

			// Verificar si el anime ya está en el array
			const animeExists = savedAnimes.includes(animeName);

			if (!animeExists) {
				// Agregar el anime al array
				savedAnimes.push(animeName);

				// Guardar el array actualizado en localStorage
				localStorage.setItem('savedAnimes', JSON.stringify(savedAnimes));
				alert(`Anime "${animeName}" guardado en la lista.`);
			} else {
				alert(`El anime "${animeName}" ya está en la lista.`);
			}
		},
	},
});

// App Component
const App = {
	template: `
    <div>
      <button @click="currentComponent = 'anime-watchlist'">Anime Watchlist</button>
      <button @click="currentComponent = 'anime-test'">Anime Test</button>
      <component :is="currentComponent" />
    </div>
  `,
	data() {
		return {
			currentComponent: null,
		};
	},
};

new Vue({
	el: '#app',
	render: h => h(App),
});
