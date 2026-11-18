// 1. MOSTRAR OU OCULTAR SENHA
function alternarSenha(idCampo) {
  const campo = document.getElementById(idCampo);
  if (campo) {
    // Alterna o tipo do input entre texto e senha
    campo.type = campo.type === "password" ? "text" : "password";
  }
}

// 2. ELEMENTOS DO FORMULÁRIO E MODAL
const formCadastro = document.getElementById("registerForm");
const modalSucesso = document.getElementById("successModal");
const botaoFecharModal = document.getElementById("closeModalBtn");

// 3. ENVIO E VALIDAÇÃO DO FORMULÁRIO
formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault(); // Impede o recarregamento da página

  // Pega os valores preenchidos
  const nome = document.getElementById("nomeCompleto").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  // Validação 1: Mínimo 6 caracteres na senha
  if (senha.length < 6) {
    alert("Atenção: A senha precisa ter no mínimo 6 caracteres.");
    return;
  }

  // Validação 2: Verificar se as duas senhas são iguais
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem! Digite novamente.");
    return;
  }

  // Mensagem de sucesso com o primeiro nome
  const primeiroNome = nome.split(" ")[0] || "Usuário";
  document.getElementById("modalSummary").textContent =
    "Olá, " + primeiroNome + "! Seu cadastro foi realizado com sucesso.";

  // Exibe o modal na tela
  modalSucesso.classList.add("active");
});

// 4. FECHAR MODAL E RETORNAR AO LOGIN
botaoFecharModal.addEventListener("click", function () {
  modalSucesso.classList.remove("active");
  formCadastro.reset(); // Limpa o formulário
  window.location.href = "../login/index.html"; // Vai para a tela de login
});
