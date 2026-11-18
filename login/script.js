// ============================================================
// PROJETO INTEGRADOR - SENAC CLÍNICA ESCOLA
// ARQUIVO: login/script.js (Enxuto e Didático)
// ============================================================

// 1. MOSTRAR OU OCULTAR A SENHA
const campoSenha = document.getElementById("password");
const botaoMostrarSenha = document.getElementById("toggle-password");

botaoMostrarSenha.addEventListener("click", function () {
  // Se for password, vira text; senão, volta para password
  campoSenha.type = campoSenha.type === "password" ? "text" : "password";
});

// 2. REDIRECIONAR PARA A TELA DE CADASTRO
function ir_cadastro() {
  window.location.href = "../cadastro/index.html";
}

// 3. VALIDAÇÃO DE ACESSO (LOGIN)
function login_acesso(event) {
  if (event) event.preventDefault(); // Impede a página de recarregar

  const email = document.getElementById("login").value.trim();
  const senha = document.getElementById("password").value;

  // Verificação de teste para a apresentação
  if (email === "maria@gmail.com") {
    alert("Login realizado com sucesso! Bem-vindo(a).");
    window.location.href = "../Gerenciamento_Usuario/page3.html"; // Entra no painel
  } else {
    alert("E-mail ou senha incorretos!\n(Dica para teste: use maria@gmail.com)");
  }
}

// 4. ENVIO DO FORMULÁRIO DE LOGIN
document.getElementById("login-form").addEventListener("submit", login_acesso);

// 5. ESQUECI A SENHA
document.getElementById("forgot-password").addEventListener("click", function (event) {
  event.preventDefault();
  alert("Em breve: recuperação de senha por e-mail.");
});
