import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      console.log('Resposta da API:', response);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        navigate('/manga');
      }, 3000); // A mensagem some após 3 segundos
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      {showMessage && <div className="message">Login bem-sucedido</div>}
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}

export default Login;