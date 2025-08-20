    /* Объявление переменных */
let movieArr   /* переменная для хранения массивов фильмов */

const url = "http://www.omdbapi.com/?apikey=54cfe099&"    /* Ссылка на АПИ с моим ключом */

    /* запись в переменные элементов страницы */
const searchForm = document.getElementById("search")
const searchArea = document.getElementById("search-area")
const searchBtn = document.getElementById("search-btn")
const movieSection = document.getElementById("movie-section")

    /* svg иконки добавления и удаления, что бы не занимали место в коде*/
const addSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM28.125 15.625C28.125 13.8991 26.7259 12.5 25 12.5C23.2741 12.5 21.875 13.8991 21.875 15.625V21.875H15.625C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H21.875V34.375C21.875 36.1009 23.2741 37.5 25 37.5C26.7259 37.5 28.125 36.1009 28.125 34.375V28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H28.125V15.625Z" 
fill="black"/>
</svg>`
const removeSvg = `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z" 
fill="black"/>
</svg>`

    /* слушатель кнопки search, при нажатии - обращение к АПИ на основании запроса пользователя */
searchBtn.addEventListener("click", function(e) {
    e.preventDefault()

    /* Запрос к АПИ на основании запроса пользователя*/
    fetch(`${url}s=${searchArea.value}`)      
    .then (res => res.json())

    /*второй then, получение первого массива с фильмами и его дозаполнение данными*/ 
    .then (data => {                    
        movieArr = data.Search /* записали в movieArr масссив по фильмам на основании поискового запроса */

        /* Получили сырые данные, дозаполняем массив недостающими данными, и ожидаем его полного заполнения */ 
        /* создаем массив промисов, т.к. map функция выполнится моментально, не дожидаясь ответа от сервера */
        let promises = movieArr.map( movie => {
            return fetch(`${url}i=${movie.imdbID}`)  /* внутри .map функции делаем запрос по каждому IMDB коду */
            .then(res => res.json())
            .then(desc => {
                const {Runtime, imdbRating, Plot, Genre} = desc
                /* вносим необходимые данные по длительности, рейтингу, сценарию и жанру*/
                movie.Runtime = Runtime
                movie.imdbRating = imdbRating
                movie.Plot = Plot
                movie.Genre = Genre

                return movie;
            })
        })
        /* Возвращаем массив промисов, чтобы Promise.all() мог его обработать */
        /* Promise.all() ждет пока все запросы внутри него завершатся(дозапросы по каждому из фильмов), и только тогда возвращает во второй .then массив с результатами */
        return Promise.all(promises)
    })

    /* третий then, запись полного массива с фильмами в movieArr (пригодится для сравнения наполнения 
    локалСторадж и фактически отраженных фильмов) и запуск функции отрисовки*/
    .then(filledArr => { 
        movieArr = filledArr 
        console.log(movieArr)      
        render(filledArr)
    })  
})

    /* функция Рендера (отрисовки на странице полученных результатов) */
function render (fullMovieArr) {
    let htmlCode = fullMovieArr.map(function(movie) {

        /* Проверка на наличие фильмов в локал сторадже 
        во избежание дублирования добавления */
        /* загрузка перечня фильмов из Локал Стораджа*/
        let localMovieWatchlist
        if (!localStorage.getItem("addedMovie")) {
            localMovieWatchlist = []
        } else {
            localMovieWatchlist = JSON.parse(localStorage.getItem("addedMovie"))
        }
        
        /* возврат булиевого значения, указывающий на наличие 
        или отсутствие полученного от АПИ фильма в локал сторадже (фильм уже был добавлен пользователем) */
        let isAdded = Boolean(localMovieWatchlist.filter(function(localMovie){
            if(localMovie.imdbID === movie.imdbID) {
                return true
            }
        })[0])

        /* запись в переменную addMovieBtn HTML кода в зависимости 
        от полученного буливого значения для последующего использования 
        в return и отрисовке*/
        let addMovieBtn
        if (isAdded) {
            addMovieBtn = `
            <p class="added-movie">Added to watchlist</p>
            `
        } else {
            addMovieBtn = `<a id="add-movie-btn" data-movie="${movie.imdbID}" href="">
                        ${addSvg} Watchlist
                        </a>`
        }

        return `
        <div class="movie-container" data-movie="${movie.imdbID}">
            <img class="movie-poster" src="${movie.Poster}" />
            <div class = "movie-text">
                <div class = "movie-text--title">
                    <h2>${movie.Title}</h2>
                    <p><img src="/icons/star-icon.png" /> ${movie.imdbRating}</p>
                </div>
                <div class = "movie-text--genre">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    ${addMovieBtn}
                </div>
                <div class="movie-text--decription">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </div>
        `
    }).join('')

    movieSection.innerHTML = htmlCode


}

 /* Нажатие на кнопку watchlist*/
/* слушатель на всю страницу, т.к. кнопок в DOM дереве до получения ответа от сервера - нет.*/
document.addEventListener("click", function(e) {
    /* реагирование на клик по кнопке add-to-watchlist*/
    if(e.target.dataset.movie) {
        e.preventDefault()
        console.log(e.target.dataset.movie)
        /* записываю в переменную addedMovie массив данных о добавленном фильме. 
        Лучше использовать метод find, но я решил оставить filter() с указанием индекса [0], что бы вернуть не массив с объектом, а объект */
        let addedMovie = movieArr.filter(function(movie){
            if (movie.imdbID === e.target.dataset.movie) {
                return movie
            }
        })[0]

        let storedData = []

    /* проверка существования localStorage*/
        if(localStorage.getItem("addedMovie")){
            /* если существует, то получаем данные и преобразуем в объект с массивами*/
            storedData =  JSON.parse(localStorage.getItem("addedMovie"))
        } else { /* Не обязательно */
            storedData = []
        }
        /* Добавляем добавленный пользователем фильм в объект массивов с фильмами*/
        storedData.push(addedMovie)

        /* записываем объект как строку в локал сторадж, тем самым обновляя перечень фильмов в локал сторадже */
        localStorage.setItem("addedMovie", JSON.stringify(storedData))

        /* повторный вызов рендера для отрисовки изменений*/
        render(movieArr)
    }
})

