import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './MangaList.css';

function MangaList({ favorites, handleAddToFavorites, isFavorite, user }) {
  const [mangas, setMangas] = useState([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const genres = [
    { value: '', label: 'Selecione' },
    { value: 'action', label: 'Ação' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mistério' },
    { value: 'romance', label: 'Romance' },
    { value: 'comedy', label: 'Comédia' },
  ];

  useEffect(() => {
    const fetchMangas = async () => {
      console.log('Fetching mangas with params:', { query, genre, sort, page });
      try {
        const response = await axios.get('https://kitsu.io/api/edge/manga', {
          params: {
            'page[limit]': 20, // Fetch more items to account for filtering
            'page[offset]': (page - 1) * 20,
            ...(query && { 'filter[text]': query }),
            ...(genre && { 'filter[categories]': genre }),
            ...(sort && { sort }),
          },
        });
        console.log('API response:', response.data);
        const filteredMangas = response.data.data.filter(manga => manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp);
        const sortedMangas = filteredMangas.sort((a, b) => {
          const titleA = a.attributes.titles.en || a.attributes.titles.en_jp || a.attributes.titles.ja_jp || '';
          const titleB = b.attributes.titles.en || b.attributes.titles.en_jp || b.attributes.titles.ja_jp || '';
          return titleA.localeCompare(titleB);
        }).slice(0, 10); // Ensure only 10 items are displayed
        setMangas(sortedMangas);
        setHasMore(response.data.data.length > 0);
      } catch (error) {
        console.error('Erro ao buscar mangás:', error);
      }
    };
    fetchMangas();
  }, [query, genre, sort, page]);

  const handleSearch = () => {
    setQuery(document.getElementById('manga-query').value);
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container">
      <h2>Buscar Mangá/Anime</h2>
      <input
        type="text"
        id="manga-query"
        placeholder="Título"
      />
      <button onClick={handleSearch}>Buscar</button>
      <div className="filters">
        <label>
          Gênero:
          <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
            {genres.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Popularidade:
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="">Selecione</option>
            <option value="popularityRank">Mais Popular</option>
            <option value="-popularityRank">Menos Popular</option>
          </select>
        </label>
      </div>
      <button>
        <Link to="/favorites">Ver Favoritos</Link>
      </button>
      {mangas.length > 0 ? (
        <>
          <ul>
            {mangas.map((manga, index) => (
              <li key={`${manga.id}-${index}`} className="manga-item">
                <span className="manga-title">
                  {manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp}
                </span>
                <FaHeart
                  onClick={() => {
                    console.log('Clicou no coração', manga); // Adicionado para depuração
                    handleAddToFavorites(manga);
                  }}
                  className="favorite-icon"
                  style={{ cursor: 'pointer', color: isFavorite(manga) ? 'red' : 'grey' }}
                />
              </li>
            ))}
          </ul>
          <div className="pagination">
            {page > 1 && (
              <button onClick={handlePreviousPage} className="previous-page">
                <FaArrowLeft /> Página Anterior
              </button>
            )}
            {hasMore && (
              <button onClick={handleNextPage} className="next-page">
                Próxima Página <FaArrowRight />
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Não há animes desse gênero disponíveis.</p>
      )}
    </div>
  );
}

export default MangaList;