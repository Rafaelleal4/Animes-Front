import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
      }, 6000); // A mensagem some após 6 segundos
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/auth/register', { username, password });
      console.log('Resposta da API:', response);
      setMessage('Registro bem-sucedido');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        navigate('/login');
      }, 6000); // A mensagem some após 6 segundos
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setMessage('Erro ao registrar: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMessage('');
      }, 6000); // A mensagem some após 6 segundos
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Registrar</h2>
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <div className={`message message-${messageType}`}>{message}</div>}
      <p>Já tem uma conta? <Link to="/login">Entre</Link></p>
    </div>
  );
}

export default Register;