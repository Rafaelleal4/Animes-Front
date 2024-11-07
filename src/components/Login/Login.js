import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      console.log('Resposta da API:', response);
      console.log('Dados da resposta:', response.data);

      // Supondo que a resposta contenha uma mensagem de sucesso
      if (response.data.message === 'Login bem-sucedido') {
        // Atualize o estado do usuário para indicar que o usuário está autenticado
        setUser({ username }); // Simule o usuário logado com o nome de usuário
        console.log('Usuário definido:', { username });

        setMessage('Login bem-sucedido');
        setMessageType('success');
        setTimeout(() => {
          setMessage('');
          navigate('/manga'); // Redireciona imediatamente após o login
        }, 1000); // A mensagem some após 1 segundo
      } else {
        throw new Error('Falha no login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setUsername('');
      setPassword('');
      setTimeout(() => {
        setMessage('');
      }, 6000); // A mensagem some após 6 segundos
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          className="input-usuario"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-senha"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <div className={`message message-${messageType}`}>{message}</div>}
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}

export default Login;