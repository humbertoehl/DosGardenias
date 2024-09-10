function filterCatalog() {
    // Obtén el valor de la barra de búsqueda
    let input = document.getElementById('search-bar').value.toLowerCase();
    let albums = document.getElementsByClassName('album-item');
    
    // Filtra los álbumes según el valor de la búsqueda
    for (let i = 0; i < albums.length; i++) {
        let albumName = albums[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        let artist = albums[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        let year = albums[i].getElementsByTagName('p')[1].innerText.toLowerCase();
        let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();
        
        // Comprobar si la búsqueda coincide con el nombre, artista, año o género
        if (albumName.includes(input) || artist.includes(input) || year.includes(input) || genres.includes(input)) {
            albums[i].style.display = '';
        } else {
            albums[i].style.display = 'none';
        }
    }
}


// Abrir y cerrar la ventana emergente (modal)
let modal = document.getElementById('genre-modal');
let openModalBtn = document.getElementById('open-modal');
let closeModalBtn = document.getElementsByClassName('close')[0];

openModalBtn.onclick = function() {
    modal.style.display = 'flex'; // Muestra el modal
}

closeModalBtn.onclick = function() {
    modal.style.display = 'none'; // Oculta el modal
}

// Ocultar el modal cuando se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Filtrar catálogo según los géneros seleccionados
document.getElementById('apply-genre-filter').onclick = function() {
    // Obtén los géneros seleccionados
    let selectedGenres = [];
    let checkboxes = document.querySelectorAll('.genre-list input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        selectedGenres.push(checkbox.value.toLowerCase());
    });

    let albums = document.getElementsByClassName('album-item');

    // Si no hay géneros seleccionados, muestra todos los álbumes
    if (selectedGenres.length === 0) {
        for (let i = 0; i < albums.length; i++) {
            albums[i].style.display = ''; // Muestra todos los álbumes
        }
    } else {
        // Filtrar los álbumes por los géneros seleccionados
        for (let i = 0; i < albums.length; i++) {
            let genres = albums[i].getElementsByClassName('genre-tags')[0].innerText.toLowerCase();
            
            // Mostrar el álbum si coincide con alguno de los géneros seleccionados
            if (selectedGenres.some(genre => genres.includes(genre))) {
                albums[i].style.display = '';
            } else {
                albums[i].style.display = 'none';
            }
        }
    }

    // Cerrar el modal después de aplicar el filtro
    modal.style.display = 'none';
}



// Función para ordenar el catálogo
function sortCatalog() {
    // Obtén la opción seleccionada en el menú desplegable
    let sortOption = document.getElementById('sort-options').value;
    let albums = Array.from(document.getElementsByClassName('album-item')); // Convierte en array para poder ordenar
    let catalogGrid = document.getElementById('catalog-grid');

    // Ordenar por la opción seleccionada
    switch (sortOption) {
        case 'year-asc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); // Año en el tercer <p>
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearB - yearA; // Orden ascendente
            });
            break;
        case 'year-desc':
            albums.sort((a, b) => {
                let yearA = parseInt(a.getElementsByTagName('p')[1].innerText); // Año en el tercer <p>
                let yearB = parseInt(b.getElementsByTagName('p')[1].innerText);
                return yearA - yearB; // Orden descendente
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
                return artistB.localeCompare(artistA); // Orden descendente
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
                return titleB.localeCompare(titleA); // Orden descendente
            });
            break;
        default:
            return; // No hacer nada si no se selecciona una opción válida
    }

    // Limpia la cuadrícula actual y agrega los álbumes ordenados
    catalogGrid.innerHTML = '';
    albums.forEach(album => catalogGrid.appendChild(album));
}
