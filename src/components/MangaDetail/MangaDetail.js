import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MangaDetail.css'; // Import the CSS file

function MangaDetail() {
  const { id } = useParams();
  const [manga, setManga] = useState(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(`https://kitsu.io/api/edge/manga/${id}`);
        setManga(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do mangá:', error);
      }
    };

    fetchManga();
  }, [id]);

  if (!manga) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="manga-detail">
      <h2>{manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp}</h2>
      <img src={manga.attributes.posterImage.large} alt={manga.attributes.titles.en || manga.attributes.titles.en_jp || manga.attributes.titles.ja_jp} />
      <p>{manga.attributes.synopsis}</p>
      <p><strong>Capítulos:</strong> {manga.attributes.chapterCount || 'N/A'}</p>
      <p><strong>Volumes:</strong> {manga.attributes.volumeCount || 'N/A'}</p>
      <p><strong>Popularidade:</strong> {manga.attributes.popularityRank}</p>
      <p><strong>Avaliação:</strong> {manga.attributes.averageRating}</p>
    </div>
  );
}

export default MangaDetail;