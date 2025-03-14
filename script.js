// Lista de usuários cadastrados (persistida no localStorage)
let users = JSON.parse(localStorage.getItem("users")) || [];

// Função para verificar se há um usuário logado
function checkLoggedInUser() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("password-manager").style.display = "block";
    displayPasswords();
  }
}

// Chamada inicial para verificar o login
checkLoggedInUser();

// Função para realizar login
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const loginPassword = document.getElementById("login-password").value;

  const user = users.find(user => user.username === username && user.password === loginPassword);

  if (user) {
    alert("Login realizado com sucesso!");
    localStorage.setItem("loggedInUser", username); // Salva o usuário logado
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("password-manager").style.display = "block";
    displayPasswords();
  } else {
    alert("Usuário ou senha incorretos!");
  }
});

// Função para cadastrar novos usuários
document.getElementById("register-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("register-username").value;
  const registerPassword = document.getElementById("register-password").value;

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    alert("Usuário já cadastrado!");
  } else {
    users.push({ username, password: registerPassword });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Cadastro realizado com sucesso! Agora faça login.");
    document.getElementById("register-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
  }
});

// Botão para alternar entre login e cadastro
document.getElementById("show-register").addEventListener("click", function() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("register-screen").style.display = "flex";
});

document.getElementById("show-login").addEventListener("click", function() {
  document.getElementById("register-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
});

// Funções do Gerenciador de Senhas
document.getElementById("password-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const siteName = document.getElementById("site-name").value;
  const password = document.getElementById("password").value;
  const category = document.getElementById("category").value;

  const passwordItem = { siteName, password, category };

  const loggedInUser = localStorage.getItem("loggedInUser");
  let savedPasswords = JSON.parse(localStorage.getItem(`passwords_${loggedInUser}`)) || [];
  savedPasswords.push(passwordItem);
  localStorage.setItem(`passwords_${loggedInUser}`, JSON.stringify(savedPasswords));

  displayPasswords();

  document.getElementById("password-form").reset();
});

// Função para exibir senhas na tela
function displayPasswords() {
  const passwordList = document.getElementById("password-list");
  passwordList.innerHTML = "";

  const loggedInUser = localStorage.getItem("loggedInUser");
  const savedPasswords = JSON.parse(localStorage.getItem(`passwords_${loggedInUser}`)) || [];

  savedPasswords.forEach((item, index) => {
    const passwordDiv = document.createElement("div");
    passwordDiv.className = "password-item";
    passwordDiv.innerHTML = `
      <strong>${item.siteName}</strong> (${item.category}): ${item.password}
      <button onclick="deletePassword(${index})">Excluir</button>
    `;
    passwordList.appendChild(passwordDiv);
  });
}

// Função para deletar uma senha
function deletePassword(index) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  let savedPasswords = JSON.parse(localStorage.getItem(`passwords_${loggedInUser}`)) || [];
  savedPasswords.splice(index, 1);
  localStorage.setItem(`passwords_${loggedInUser}`, JSON.stringify(savedPasswords));
  displayPasswords();
}

// Função para gerar uma senha forte
function generateStrongPassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Adicionando evento ao botão de gerar senha
document.getElementById("generate-password").addEventListener("click", function() {
  const generatedPassword = generateStrongPassword();
  document.getElementById("generated-password").value = generatedPassword; // Exibe no campo "Senha Gerada"
  document.getElementById("password").value = generatedPassword; // Preenche automaticamente o campo de senha
});

// Inicializando a exibição das senhas ao carregar a página
displayPasswords();