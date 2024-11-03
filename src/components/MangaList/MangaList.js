import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchMangas = async () => {
      if (query) {
        try {
          const response = await axios.get(`https://kitsu.io/api/edge/manga`, {
            params: {
              'filter[text]': query,
            },
          });
          setMangas(response.data.data);
        } catch (error) {
          console.error('Erro ao buscar mangás:', error);
        }
      }
    };

    fetchMangas();
  }, [query]);

  const handleSearch = () => {
    setQuery(document.getElementById('manga-query').value);
  };

  return (
    <div>
      <h2>Buscar Mangá/Anime</h2>
      <input
        type="text"
        id="manga-query"
        placeholder="Título"
        required
      />
      <button onClick={handleSearch}>Buscar</button>
      <ul>
        {mangas.map((manga) => (
          <li key={manga.id}>
            {manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MangaList;