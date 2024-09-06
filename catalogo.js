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
