import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import MangaList from './components/MangaList/MangaList';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Favorites from './components/Favorites/Favorites';
import MangaDetails from './components/MangaDetails/MangaDetails';
import axios from 'axios';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/favorites');
      const favoriteMangas = response.data.favorites;
      console.log('Estrutura dos dados retornados:', favoriteMangas); // Adicionado para depuração
      setFavorites(favoriteMangas);
      console.log('Favoritos carregados:', favoriteMangas);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  }, [user]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/user');
      setUser(response.data.user);
      setFavorites([]); // Limpa os favoritos antes de buscar os novos
      console.log('Usuário logado:', response.data.user);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      if (error.response && error.response.status === 404) {
        console.error('Rota /auth/user não encontrada');
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const handleAddToFavorites = async (manga) => {
    console.log('handleAddToFavorites foi chamada'); // Adicionado para depuração

    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      // Adiciona um console.log para verificar a estrutura dos dados do mangá
      console.log('Dados completos do mangá:', manga);

      // Usa o título canônico ou define como 'Título Desconhecido' se não houver nenhum título
      const title = manga.attributes.canonicalTitle || 'Título Desconhecido';
      console.log('Título do mangá:', title);

      const response = await axios.post('http://localhost:5000/api/auth/favorites', {
        mangaId: manga.id,
        title: title,
      });
      setFavorites([...favorites, response.data.favorite]);
      console.log('Mangá adicionado aos favoritos:', response.data.favorite);
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
    }
  };

  const handleRemoveFromFavorites = async (mangaId) => {
    if (!user) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      console.log('Removendo mangá dos favoritos:', mangaId); // Adicionado para depuração
      await axios.delete(`http://localhost:5000/api/auth/favorites/${mangaId}`);
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.mangaId !== mangaId));
      console.log('Mangá removido dos favoritos:', mangaId);
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
    }
  };

  const isFavorite = (manga) => {
    return favorites.some(fav => fav.mangaId === manga.id);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Bem-vindo ao Manga/Anime Finder</h1>
          {user && <LogoutButton setUser={setUser} setFavorites={setFavorites} />}
        </header>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manga" element={
            user ? (
              <MangaList
                favorites={favorites}
                handleAddToFavorites={handleAddToFavorites}
                isFavorite={isFavorite}
                user={user}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/favorites" element={
            user ? (
              <Favorites
                favorites={favorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/manga/:id" element={<MangaDetails />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

function LogoutButton({ setUser, setFavorites }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setUser(null);
      setFavorites([]);
      console.log('Usuário deslogado');
      navigate('/login'); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return <button onClick={handleLogout}>Trocar de Usuário</button>;
}

export default App;