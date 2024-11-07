import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MangaDetails.css';

function MangaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`https://kitsu.io/api/edge/manga/${id}`);
        setManga(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do mangá:', error);
      }
    };

    fetchMangaDetails();
  }, [id]);

  if (!manga) {
    return <div>Carregando...</div>;
  }

  const { titles, synopsis, posterImage } = manga.attributes;
  const title = titles.en || titles.en_jp || titles.ja_jp;

  // Verificar se a sinopse não é null antes de chamar split
  const sentences = synopsis ? synopsis.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/) : [];
  const combinedSentences = sentences.reduce((acc, sentence) => {
    if (acc.length === 0) {
      return [sentence];
    }
    const lastSentence = acc[acc.length - 1];
    if (lastSentence.length < 50) {
      acc[acc.length - 1] = `${lastSentence} ${sentence}`;
    } else {
      acc.push(sentence);
    }
    return acc;
  }, []);

  const synopsisParagraphs = combinedSentences.map((text, index) => (
    <p key={index}>{text}</p>
  ));

  return (
    <div className="manga-details">
      <h2>{title}</h2>
      <img src={posterImage.large} alt={title} />
      <div className="synopsis">
        {synopsisParagraphs}
      </div>
      <button className="back-button" onClick={() => navigate('/manga')}>Voltar para a Busca</button>
    </div>
  );
}

export default MangaDetails;