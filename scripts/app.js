const recommendations = {
	action: {
		netflix: {
			classic: {
				name: 'Fullmetal Alchemist: Brotherhood',
				img: '../img/anime/fma.jpg'
			},
			new: {
				name: 'Attack on Titan',
				img: '../img/anime/aot.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Naruto',
				img: '../img/anime/naruto.jpg'
			},
			new: {
				name: 'Demon Slayer: Kimetsu no Yaiba',
				img: '../img/anime/demon.jpg'
			}
		}
	},
	mystery: {
		netflix: {
			classic: {
				name: 'Death Note',
				img: '../img/anime/note.jpg'
			},
			new: {
				name: 'The Promised Neverland',
				img: '../img/anime/neverland.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Hyouka',
				img: '../img/anime/hyouka.jpg'
			},
			new: {
				name: 'Erased',
				img: '../img/anime/erased.jpg'
			}
		}
	},
	adventure: {
		netflix: {
			classic: {
				name: 'One Piece',
				img: '../img/anime/one.jpg'
			},
			new: {
				name: 'Hunter x Hunter',
				img: '../img/anime/hunter.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Dragon Ball Z',
				img: '../img/anime/dragon.jpg'
			},
			new: {
				name: 'My Hero Academia',
				img: '../img/anime/hero.jpg'
			}
		}
	},
	comedy: {
		netflix: {
			classic: {
				name: 'Great Teacher Onizuka',
				img: '../img/anime/gto.jpg'
			},
			new: {
				name: 'One Punch Man',
				img: '../img/anime/punch.jpg'
			}
		},
		crunchyroll: {
			classic: {
				name: 'Nichijou',
				img: '../img/anime/nichi.jpg'
			},
			new: {
				name: 'Kaguya-sama: Love is War',
				img: '../img/anime/kaguya.jpg'
			}
		}
	}
};


Vue.prototype.$recommendations = recommendations;

Vue.component('anime-watchlist', {
	template: `
    <div class="container mt-4">
        <h2>Anime Watchlist</h2>
        <ul v-if="watchlist.length > 0" class="list-group">
            <li v-for="anime in watchlist" :key="anime.name" class="list-group-item">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <img :src="getAnimeImage(anime)" alt="Anime Image" class="img-fluid" />
                    </div>
                    <div class="col-md-9">
                        {{ anime.name | uppercase }} ({{ anime.watched ? 'Visto' : 'No visto' }})
						<div class="col-md-9">
							<span v-if="anime.recomend !== null">Recomendado: {{ anime.recomend ? 'Sí' : 'No' }}</span>
							<button v-if="anime.watched" @click="toggleRecommend(anime)" class="btn btn-primary">Recomendar</button>
							<button @click="toggleWatched(anime)" class="btn btn-success">
								Marcar como {{ anime.watched ? 'No visto' : 'Visto' }}
							</button>
							<button v-if="anime.watched" @click="startWritingReview(anime)" class="btn btn-primary">
								{{ anime.review ? 'Modificar Review' : 'Escribir Review' }}
							</button>
							<button @click="removeFromWatchlist(anime)" class="btn btn-danger">Eliminar</button>
							<div v-if="anime.writingReview">
								<textarea v-model="anime.review" rows="4" cols="50" class="form-control"></textarea>
								<button @click="saveReview(anime)" class="btn btn-primary">Guardar Review</button>
							</div>
							<p v-else-if="anime.review" class="mt-2">Review: {{ anime.review }}</p>
						</div>
                    </div>
                </div>
            </li>
        </ul>
        <p v-else class="mt-4">No hay animes pendientes en la watchlist.</p>
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
			for (var anime of savedAnimes) {
				anime.writingReview = false;
			}
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

			if (!anime.watched) {
				anime.recomend = null;
				anime.review = null;
				anime.writingReview = false;
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

Vue.component('anime-test', {
	template: `
    <div class="container mt-4">
        <h2>Anime Recommendation Test</h2>
		<div v-if="step === 0">
			<div class="form-group">
				<label for="username">Ingresa tu nombre:</label>
				<input id="username" v-model="username" class="form-control" required />
				<p v-if="step === 0 && nameError" class="text-danger">Por favor ingresa un nombre.</p>
			</div>
			<button @click="nextStep" class="btn btn-primary">Next</button>
		</div>
        <div v-else-if="step === 1">
            <label>Selecciona un genero:</label>
            <div>
                <button v-for="genre in genres" :key="genre" @click="selectGenre(genre)" class="btn btn-secondary">{{ translateToSpanish(genre) }}</button>
            </div>
        </div>
        <div v-else-if="step === 2">
            <label>Selecciona una plataforma de streaming:</label>
            <div>
                <button v-for="platform in platforms" :key="platform" @click="selectPlatform(platform)" class="btn btn-secondary">{{ platform }}</button>
            </div>
        </div>
        <div v-else-if="step === 3">
            <label>Preferis un algo nuevo o un clasico?</label>
            <div>
                <button v-for="type in types" :key="type" @click="selectType(type)" class="btn btn-secondary">{{ translateToSpanish(type) }}</button>
            </div>
        </div>
        <div v-else-if="step === 4">
            <h3>Confirma lo que ingresaste:</h3>
            <p>Name: {{ username }}</p>
            <p>Genre: {{ translateToSpanish(selectedGenre) }}</p>
            <p>Platform: {{ selectedPlatform }}</p>
            <p>Type: {{ translateToSpanish(selectedType) }}</p>
            <button @click="showRecommendation" class="btn btn-primary">Confirm</button>
        </div>
        <div v-else-if="step === 5">
            <h3>Recommendation:</h3>
            <p>Hola {{ username }}! Te recomiendo {{ recommendation.name }}</p>
            <button @click="saveRecommendation" class="btn btn-success">Agregar recomendacion a la watchlist</button>
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
			nameError: false,
		};
	},
	methods: {
		nextStep() {
			if (this.step === 0 && !this.username) {
				this.nameError = true;
				return;
			}

			this.nameError = false;
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
			this.recommendation = this.$recommendations[this.selectedGenre.toLowerCase()][this.selectedPlatform.toLowerCase()][this.selectedType.toLowerCase()];
			this.step++;
		},
		saveRecommendation() {
			const animeName = this.recommendation.name;

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
				var animeToSave = {
					"name": animeName,
					"watched": false,
					"recomend": null,
					"review": null,
					"img": this.recommendation.img,
					"createdAt": Date.now()
				};

				savedAnimes.push(animeToSave);
				localStorage.setItem('savedAnimes', JSON.stringify(savedAnimes));
			}
			this.$emit('recommendation-saved');
		},
		translateToSpanish(word) {
			const translationMap = {
				'Action': 'Acción',
				'Mystery': 'Misterio',
				'Adventure': 'Aventura',
				'Comedy': 'Comedia',
				'Classic': 'Clásico',
				'New': 'Nuevo',
			};

			return translationMap[word] || word;
		}
	},
});


// App Component
const App = {
	template: `
    <div>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Anime App</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" @click="currentComponent = 'anime-watchlist'" href="#">Anime Watchlist</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" @click="currentComponent = 'anime-test'" href="#">Anime Test</a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Contenedor principal -->
        <div>
            <component :is="currentComponent" @recommendation-saved="switchToWatchlist" />
        </div>
    </div>
    `,
	data() {
		return {
			currentComponent: "anime-watchlist",
		};
	},
	methods: {
		switchToWatchlist() {
			this.currentComponent = "anime-watchlist";
			this.$nextTick(() => {
				this.$refs.watchlist.loadWatchlist();
			});
		}
	}
};

new Vue({
	el: '#app',
	render: h => h(App),
	});
