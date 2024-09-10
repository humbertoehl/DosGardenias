//BARRA DE BÚSQUEDA
function filterCatalog() {
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-item');
    
    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByTagName('p')[1].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();
        
        if (albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input)) {
            albums[i].style.display = '';
        } else {
            albums[i].style.display = 'none';
        }
    }
}

// MOSTRAR GÉNEROS SELECCIONADOS
function updateSelectedGenresDisplay(selectedGenres) {
    const selectedGenresContainer = document.getElementById('selected-genres');
    selectedGenresContainer.innerHTML = ''; 

    if (selectedGenres.length === 0) {
        selectedGenresContainer.innerHTML = '<span>No hay géneros seleccionados.</span>';
        return;
    }

    selectedGenres.forEach(genre => {
        const genreElement = document.createElement('div');
        genreElement.classList.add('selected-genre');
        genreElement.textContent = genre;

        const removeBtn = document.createElement('span');
        removeBtn.classList.add('remove-genre');
        removeBtn.textContent = '×'; 
        removeBtn.onclick = () => {

            const checkbox = document.querySelector(`.genre-list input[type="checkbox"][value="${genre}"]`);
            if (checkbox) {
                checkbox.checked = false;
                applyGenreFilter();
            }
        };

        genreElement.appendChild(removeBtn);
        selectedGenresContainer.appendChild(genreElement);
    });
}



// VENTANA EMERGENTE DE GÉNEROS
let modal = document.getElementById('genre-modal');
let openModalBtn = document.getElementById('open-modal');
let closeModalBtn = document.getElementsByClassName('close')[0];

openModalBtn.onclick = function() {
    modal.style.display = 'flex'; 
}

closeModalBtn.onclick = function() {
    modal.style.display = 'none'; 
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// FILTRO DE GÉNEROS
function applyGenreFilter() {
    let selectedGenres = [];
    let checkboxes = document.querySelectorAll('.genre-list input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        selectedGenres.push(checkbox.value);
    });

    let albums = document.getElementsByClassName('album-item');

    if (selectedGenres.length === 0) {
        for (let i = 0; i < albums.length; i++) {
            albums[i].style.display = ''; 
        }
    } else {
        for (let i = 0; i < albums.length; i++) {
            let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();

            let lowerSelectedGenres = selectedGenres.map(g => g.toLowerCase());

            if (lowerSelectedGenres.some(genre => genres.includes(genre))) {
                albums[i].style.display = '';
            } else {
                albums[i].style.display = 'none';
            }
        }
    }

    updateSelectedGenresDisplay(selectedGenres);

    modal.style.display = 'none';
}

document.getElementById('apply-genre-filter').onclick = applyGenreFilter;



// ORDENAMIENTO
function sortCatalog() {
    let sortOption = document.getElementById('sort-options').value;
    let albums = Array.from(document.getElementsByClassName('album-item')); 
    let catalogGrid = document.getElementById('catalog-grid');

    switch (sortOption) {
        case 'year-asc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); 
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearB - yearA; 
            });
            break;
        case 'year-desc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); 
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearA - yearB; 
            });
            break;
        case 'artist-asc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('p')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('p')[0].innerText.toLowerCase();
                return artistA.localeCompare(artistB);
            });
            break;
        case 'artist-desc':
            albums.sort((a, b) => {
                let artistA = a.getElementsByTagName('p')[0].innerText.toLowerCase();
                let artistB = b.getElementsByTagName('p')[0].innerText.toLowerCase();
                return artistB.localeCompare(artistA); 
            });
            break;
        case 'title-asc':
            albums.sort((a, b) => {
                let titleA = a.getElementsByTagName('h2')[0].innerText.toLowerCase();
                let titleB = b.getElementsByTagName('h2')[0].innerText.toLowerCase();
                return titleA.localeCompare(titleB);
            });
            break;
        case 'title-desc':
            albums.sort((a, b) => {
                let titleA = a.getElementsByTagName('h2')[0].innerText.toLowerCase();
                let titleB = b.getElementsByTagName('h2')[0].innerText.toLowerCase();
                return titleB.localeCompare(titleA); 
            });
            break;
        default:
            return; 
    }

    catalogGrid.innerHTML = '';
    albums.forEach(album => catalogGrid.appendChild(album));
}
