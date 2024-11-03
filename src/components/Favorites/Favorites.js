import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import './Favorites.css';

function Favorites({ favorites, handleAddToFavorites, isFavorite }) {
  return (
    <div className="container">
      <h2>Favoritos</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((manga, index) => (
            <li key={`${manga.id}-${index}`} className="manga-item">
              <Link to={`/manga/${manga.id}`} className="manga-title">
                {manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp}
              </Link>
              <FaHeart
                onClick={() => handleAddToFavorites(manga)}
                className="favorite-icon"
                style={{ cursor: 'pointer', color: isFavorite(manga) ? 'red' : 'grey' }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Você não tem favoritos ainda.</p>
      )}
      <button>
        <Link to="/manga">Voltar para Buscas</Link>
      </button>
    </div>
  );
}

export default Favorites;