// ===

const apiKey = "e4ea898a";

let currentPage = 1;
let lastSearch = "";
let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];



async function searchMovie() {

const movieName =
document.getElementById("movieInput").value;

if (!movieName) return;

document
.getElementById("emptyState")
.style.display = "none";

if (movieName !== lastSearch) {

currentPage = 1;

}

lastSearch = movieName;

const result =
document.getElementById("movieResult");

/* tampilkan skeleton dulu */

result.innerHTML = "";

for (let i = 0; i < 6; i++) {

result.innerHTML += `
<div class="skeleton-card"></div>
`;

}



const url =
`https://www.omdbapi.com/?s=${movieName}&page=${currentPage}&apikey=${apiKey}`;

try {

const response = await fetch(url);

const data = await response.json();

/* kosongkan skeleton */

result.innerHTML = "";

if (data.Response === "True") {

for (let movie of data.Search) {

result.innerHTML += `

<div class="movieCard fade-in">

<button class="favBtn"
onclick='addFavorite(${JSON.stringify(movie)})'>
⭐
</button>

<img
src="${
movie.Poster !== "N/A"
? movie.Poster
: "no-image.png"
}"
onclick="getMovieDetail('${movie.imdbID}')"
>

<h3>${movie.Title}</h3>

<p>📅 ${movie.Year}</p>

</div>

`;

}

} else {

result.innerHTML =
"<p class='loading'>Film tidak ditemukan 😢</p>";

}

} catch (error) {

result.innerHTML =
"<p class='loading'>Error mengambil data</p>";

}

}

async function getMovieDetail(id) {

const modal =
document.getElementById("movieModal");

const body =
document.getElementById("modalBody");

/* buka modal */

modal.style.display = "flex";

/* loading */

body.innerHTML =
"<p class='loading'>Loading detail...</p>";

const url =
`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

try {

const response = await fetch(url);

const movie =
await response.json();

body.innerHTML = `

<h2>${movie.Title}</h2>

<img
src="${
movie.Poster !== "N/A"
? movie.Poster
: "no-image.png"
}">

<p><b>Year:</b> ${movie.Year}</p>

<p><b>Genre:</b> ${movie.Genre}</p>

<p><b>Rating:</b> ⭐ ${movie.imdbRating}</p>

<p>${movie.Plot}</p>

`;

} catch (error) {

body.innerHTML =
"<p>Error mengambil detail</p>";

}

}





function closeModal() {

document.getElementById("movieModal")
.style.display = "none";

}


function nextPage() {

currentPage++;

searchMovie();

}

function prevPage() {

if (currentPage > 1) {

currentPage--;

searchMovie();

}

}
function addFavorite(movie) {

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

/* cek apakah sudah ada */

const index =
favorites.findIndex(
m => m.imdbID === movie.imdbID
);

if (index === -1) {

/* tambah favorite */

favorites.push(movie);

} else {

/* hapus favorite */

favorites.splice(index, 1);

}

/* simpan ulang */

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

/* reload tampilan */

loadTrendingMovies();
loadTrendingAnime();

}




document
.getElementById("movieInput")
.addEventListener("keypress", function(e) {

if (e.key === "Enter") {

searchMovie();

}

});

function showFavorites() {

const result =
document.getElementById("movieResult");

const anime =
document.getElementById("animeResult");

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

result.innerHTML = "";
anime.innerHTML = "";


if (favorites.length === 0) {

result.innerHTML =
"<p>Tidak ada favorite ⭐</p>";

return;

}

displayMovies(
favorites,
"movieResult"
);

}


async function loadTrending() {

const result =
document.getElementById("movieResult");

/* skeleton loading */

result.innerHTML = "";

for (let i = 0; i < 10; i++) {

result.innerHTML +=
`<div class="skeleton-card"></div>`;

}

/* keyword banyak */

const trendingList = [

"Avengers",
"Batman",
"Spider",
"Dune",
"John Wick",
"Mission",
"Fast",
"Marvel",
"DC",
"Godzilla",
"Horror",
"Anime",
"Comedy",
"Action",
"War",
"Hero",
"Love",

"Naruto",
"One Piece",
"Dragon Ball",
"Attack on Titan",
"Demon Slayer",
"Jujutsu Kaisen",
"My Hero Academia",
"Tokyo Revengers",
"Bleach",
"Anime"

];

/* ambil 3 keyword random */

let selectedKeywords = [];

for (let i = 0; i < 3; i++) {

const randomKeyword =
trendingList[
Math.floor(
Math.random() *
trendingList.length
)
];

selectedKeywords.push(randomKeyword);

}

try {

let allMovies = [];

/* ambil 2 page dari tiap keyword */

for (let keyword of selectedKeywords) {

for (let page = 1; page <= 3; page++) {

const url =
`https://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=${apiKey}`;

const response =
await fetch(url);

const data =
await response.json();

if (data.Response === "True") {

const filteredMovies =
data.Search.filter(movie => {

const year =
parseInt(movie.Year);

return year >= 2020;

});

allMovies =
allMovies.concat(filteredMovies);

}

}

}

const uniqueMovies =
Array.from(
new Map(
allMovies.map(m => [m.imdbID, m])
).values()
);

/* tampilkan */

displayMovies(uniqueMovies);

} catch (error) {

result.innerHTML =
"<p>Error memuat trending</p>";

}

}

window.onload = function() {

loadTrendingMovies();

loadTrendingAnime();

};


async function loadLatestMovies() {

const result =
document.getElementById("movieResult");

result.innerHTML = "";

for (let i = 0; i < 6; i++) {

result.innerHTML +=
`<div class="skeleton-card"></div>`;

}

const keywords = [
"love",
"war",
"king",
"hero",
"night",
"dark",
"girl",
"boy",
"world"
];

const keyword =
keywords[
Math.floor(
Math.random() *
keywords.length
)
];

const url =
`https://www.omdbapi.com/?s=${keyword}&y=${randomYear}&apikey=${apiKey}`;

try {

const response =
await fetch(url);

const data =
await response.json();

if (data.Response === "True") {

displayMovies(data.Search);

}

} catch (error) {

result.innerHTML =
"<p>Error memuat film</p>";

}

}


function isFavorite(id) {

return favorites.some(
movie => movie.imdbID === id
);

}



function displayMovies(movies, containerId) {

const container =
document.getElementById(containerId);

container.innerHTML = "";

movies.slice(0, 8).forEach(movie => {

const poster =
movie.Poster !== "N/A"
? movie.Poster
: "no-image.png";


const isFav =
isFavorite(movie.imdbID);

const favClass =
isFav ? " fav-active" : "";


container.innerHTML += `

<div class="movieCard fade-in">

<button class="favBtn${favClass}"
onclick='addFavorite(${JSON.stringify(movie)})'>
⭐
</button>

<img
src="${poster}"
onclick="getMovieDetail('${movie.imdbID}')"
>

<h3>${movie.Title}</h3>

<p>📅 ${movie.Year}</p>

</div>

`;

});

}



document
.getElementById("favoriteBtn")
.addEventListener("click", showFavorites);






async function loadTrendingMovies() {

const result =
document.getElementById("movieResult");

result.innerHTML = "";

/* Skeleton loading */

for (let i = 0; i < 8; i++) {
result.innerHTML +=
`<div class="skeleton-card"></div>`;
}

/* keyword banyak */

const movieKeywords = [

"Dune",
"Avatar",
"Batman",
"Marvel",
"Spider",
"Fast",
"Mission",
"John Wick",
"Oppenheimer",
"Barbie",
"Transformers",
"Godzilla",
"Venom",
"Joker",
"Thor"

];

/* ambil 3 keyword random */

let selectedKeywords = [];

for (let i = 0; i < 3; i++) {

const randomKeyword =
movieKeywords[
Math.floor(
Math.random() *
movieKeywords.length
)
];

selectedKeywords.push(randomKeyword);

}

let allMovies = [];

try {

/* ambil random page */

for (let keyword of selectedKeywords) {

const randomPage =
Math.floor(Math.random() * 3) + 1;

const url =
`https://www.omdbapi.com/?s=${keyword}&page=${randomPage}&apikey=${apiKey}`;

const response =
await fetch(url);

const data =
await response.json();

if (data.Response === "True") {

const filtered =
data.Search.filter(movie => {

const year =
parseInt(movie.Year);

return year >= 2020;

});
allMovies =
allMovies.concat(filtered);

}

}

/* hapus duplikat */

const uniqueMovies =
Array.from(
new Map(
allMovies.map(m => [m.imdbID, m])
).values()
);

/* acak urutan film */

uniqueMovies.sort(() =>
Math.random() - 0.5
);

displayMovies(
uniqueMovies,
"movieResult"
);

} catch (error) {

result.innerHTML =
"<p>Error memuat movie</p>";

}

}

async function loadTrendingAnime() {

const result =
document.getElementById("animeResult");

/* Skeleton */

result.innerHTML = "";

for (let i = 0; i < 6; i++) {

result.innerHTML +=
`<div class="skeleton-card"></div>`;

}

const animeKeywords = [

"Naruto",
"One Piece",
"Demon Slayer",
"Jujutsu Kaisen",
"Attack on Titan",
"Dragon Ball",
"Bleach",
"Tokyo Revengers",
"My Hero Academia",
"Chainsaw Man",
"Spy x Family",
"Black Clover",
"Haikyuu",
"Solo Leveling",
"Blue Lock",
"Boruto",
"Tokyo Ghoul",
"Fairy Tail"

];

/* ambil random keyword */

const keyword =
animeKeywords[
Math.floor(
Math.random() *
animeKeywords.length
)
];

try {

const url =
`https://www.omdbapi.com/?s=${keyword}&apikey=${apiKey}`;

const response =
await fetch(url);

const data =
await response.json();

if (data.Response === "True") {

const filtered =
data.Search.filter(movie =>
parseInt(movie.Year) >= 2018
);

displayMovies(
filtered,
"animeResult"
);

}

} catch (error) {

result.innerHTML =
"<p>Error memuat anime</p>";

}

}

setInterval(() => {
loadTrendingMovies();
loadTrendingAnime();
}, 60000);


