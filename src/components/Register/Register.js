import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, password });
      if (response.data) {
        alert('Cadastro bem-sucedido');
        navigate('/login');
      } else {
        alert('Erro ao cadastrar: Resposta inesperada do servidor');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Cadastro</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
    </div>
  );
}

export default Register;