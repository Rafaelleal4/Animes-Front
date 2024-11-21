import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import './Favorites.css';

function Favorites({ favorites, handleRemoveFromFavorites, isFavorite }) {
  return (
    <div className="container">
      <h2>Favoritos</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((manga, index) => (
            <li key={`${manga.mangaId}-${index}`} className="manga-item">
              <Link to={`/manga/${manga.mangaId}`} className="manga-title">
                {manga.title || 'Título Desconhecido'}
              </Link>
              <FaHeart
                onClick={() => handleRemoveFromFavorites(manga.mangaId)}
                className="favorite-icon"
                style={{ cursor: 'pointer', color: 'red' }}
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