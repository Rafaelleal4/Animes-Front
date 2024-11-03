import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, password });
      console.log('Resposta da API:', response);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        navigate('/login');
      }, 3000); // A mensagem some após 3 segundos
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      {showMessage && <div className="message">Cadastro bem-sucedido</div>}
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