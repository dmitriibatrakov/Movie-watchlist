    /* Объявление переменных */
    /* Запись в переменную вотчлиста из локал сторадла*/
let localMovieWatchlist = JSON.parse(localStorage.getItem("addedMovie"))

    /* запись в переменные элементов страницы */
const movieSection = document.getElementById("movie-section")

    /* svg иконки добавления и удаления, что бы не занимали место в коде*/
const removeSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z" 
fill="black"/>
</svg>`
const addSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM28.125 15.625C28.125 13.8991 26.7259 12.5 25 12.5C23.2741 12.5 21.875 13.8991 21.875 15.625V21.875H15.625C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H21.875V34.375C21.875 36.1009 23.2741 37.5 25 37.5C26.7259 37.5 28.125 36.1009 28.125 34.375V28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H28.125V15.625Z" 
fill="black"/>
</svg>`

    /* вызов функции первичного рендера путем загрузки данных из localStorage*/ 
    render(localMovieWatchlist)

    /* Слушатель и функция на удаление фильма из Вотчлиста и Локал стораджа*/
document.addEventListener("click", function(e){
    if (e.target.dataset.movie) {
        e.preventDefault()
        let deletingMovie = localMovieWatchlist.find(function(movie){
            if(movie.imdbID === e.target.dataset.movie) {
                return movie
            }
        })
        localMovieWatchlist.splice(localMovieWatchlist.indexOf(deletingMovie), 1)
        localStorage.setItem("addedMovie", JSON.stringify(localMovieWatchlist))
        render(localMovieWatchlist)
    }
})

/* функция рендера. При пустом вотчлисте-отрисовка заглушки. */
function render(localMovieWatchlist) {
    if (localStorage.getItem("addedMovie") === "[]" || !localStorage.getItem("addedMovie")) {
    movieSection.innerHTML = `
                <div class="no-data-plug"> 
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html">
                    ${addSvg}
                    Let's add some movies!
                </a>
            </div>
    `
    } else {
    let htmlBlock = localMovieWatchlist.map(function(movie) {
        return `
        <div class="movie-container">
            <img class="movie-poster" src="${movie.Poster}" />
            <div class = "movie-text">
                <div class = "movie-text--title">
                    <h2>${movie.Title}</h2>
                    <p><img src="/icons/star-icon.png" /> ${movie.imdbRating}</p>
                </div>
                <div class = "movie-text--genre">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <a data-movie="${movie.imdbID}" href="">
                        ${removeSvg} Remove
                    </a>
                </div>
                <div class="movie-text--decription">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>
        `
    }).join('')

    movieSection.innerHTML = htmlBlock
}

}