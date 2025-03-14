import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("loggedInUser"));
  const [siteName, setSiteName] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [savedPasswords, setSavedPasswords] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      displayPasswords();
    }
  }, [loggedInUser]);

  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const loginPassword = event.target.loginPassword.value;
    const user = users.find(user => user.username === username && user.password === loginPassword);

    if (user) {
      alert("Login realizado com sucesso!");
      localStorage.setItem("loggedInUser", username);
      setLoggedInUser(username);
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const username = event.target.registerUsername.value;
    const registerPassword = event.target.registerPassword.value;
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      alert("Usuário já cadastrado!");
    } else {
      const newUser = { username, password: registerPassword };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert("Cadastro realizado com sucesso! Agora faça login.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    alert("Você saiu com sucesso!");
  };

  const handleAddPassword = (event) => {
    event.preventDefault();
    const passwordItem = { siteName, password, category };
    const updatedPasswords = [...savedPasswords, passwordItem];
    localStorage.setItem(`passwords_${loggedInUser}`, JSON.stringify(updatedPasswords));
    setSavedPasswords(updatedPasswords);
    setSiteName('');
    setPassword('');
    setCategory('');
  };

  const displayPasswords = () => {
    const passwords = JSON.parse(localStorage.getItem(`passwords_${loggedInUser}`)) || [];
    setSavedPasswords(passwords);
  };

  const deletePassword = (index) => {
    const updatedPasswords = savedPasswords.filter((_, i) => i !== index);
    localStorage.setItem(`passwords_${loggedInUser}`, JSON.stringify(updatedPasswords));
    setSavedPasswords(updatedPasswords);
  };

  const generateStrongPassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setGeneratedPassword(password);
    setPassword(password);
  };

  return (
    <div className="App">
      <h1>Gerenciador de Senhas</h1>
      {!loggedInUser ? (
        <div>
          <div id="login-screen">
            <form id="login-form" onSubmit={handleLogin}>
              <h2>Login</h2>
              <input type="text" name="username" placeholder="Nome de Usuário ou E-mail" required />
              <input type="password" name="loginPassword" placeholder="Senha" required />
              <button type="submit">Entrar</button>
              <p>Não tem uma conta? <button type="button" onClick={() => document.getElementById("register-screen").style.display = "flex"}>Cadastre-se</button></p>
            </form>
          </div>
          <div id="register-screen" style={{ display: 'none' }}>
            <form id="register-form" onSubmit={handleRegister}>
              <h2>Cadastro</h2>
              <input type="text" name="registerUsername" placeholder="Nome de Usuário ou E-mail" required />
              <input type="password" name="registerPassword" placeholder="Senha" required />
              <button type="submit">Cadastrar</button>
              <p>Já tem uma conta? <button type="button" onClick={() => document.getElementById("register-screen").style.display = "none"}>Faça login</button></p>
            </form>
          </div>
        </div>
      ) : (
        <div id="password-manager">
          <button id="logout-button" onClick={handleLogout}>Sair</button>
          <form id="password-form" onSubmit={handleAddPassword}>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Nome do site ou serviço" required />
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="social">Redes Sociais</option>
              <option value="email">E-mail</option>
              <option value="bank">Banco</option>
              <option value="other">Outros</option>
            </select>
            <input type="text" value={generatedPassword} placeholder="Senha Gerada" readOnly />
            <button type="button" onClick={generateStrongPassword}>Gerar Senha Forte</button>
            <button type="submit">Adicionar Senha</button>
          </form>
          <h2>Senhas Salvas</h2>
          <div id="password-list">
            {savedPasswords.map((item, index) => (
              <div key={index} className="password-item">
                <strong>{item.siteName}</strong> ({item.category}): {item.password}
                <button onClick={() => deletePassword(index)}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;