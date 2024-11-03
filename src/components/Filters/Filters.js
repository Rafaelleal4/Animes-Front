import React from 'react';
import { FaHeart } from 'react-icons/fa';
import './Filters.css'; // Import the CSS file

function Filters({ genre, setGenre, sort, setSort, favorites, handleAddToFavorites, isFavorite }) {
  const genres = [
    { value: '', label: 'Selecione' },
    { value: 'action', label: 'Ação' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'comedy', label: 'Comédia' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasia' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mistério' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Ficção Científica' },
  ];

  return (
    <div className="filters">
      <label>
        Gênero:
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          {genres.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Popularidade:
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Selecione</option>
          <option value="popularityRank">Mais Popular</option>
          <option value="-popularityRank">Menos Popular</option>
        </select>
      </label>
      <h2>Favoritos</h2>
      <ul>
        {favorites.map((manga) => (
          <li key={manga.id} className="favorite-item">
            {manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp}
            <FaHeart
              onClick={() => handleAddToFavorites(manga)}
              className="favorite-icon"
              style={{ cursor: 'pointer', color: isFavorite(manga) ? 'red' : 'grey' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Filters;