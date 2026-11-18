// 1. LISTA DE USUÁRIOS CADASTRADOS (Base de Dados Simulada)
const usuarios = [
  { nome: "Ana Beatriz Costa", email: "ana.beatriz@gmail.com", cpf: "983.281.446-18", papel: "Modelo" },
  { nome: "Bruno Lima", email: "bruno.lima@senac.br", cpf: "581.338.274-19", papel: "Aluno" },
  { nome: "Camila Rocha", email: "aluno@senac.br", cpf: "452.118.903-71", papel: "Aluno" },
  { nome: "Carla Mendes", email: "carla.mendes@gmail.com", cpf: "782.150.334-61", papel: "Modelo" },
  { nome: "Fernanda Ribeiro", email: "fr.ribeiro@gmail.com", cpf: "219.664.883-47", papel: "Modelo" },
  { nome: "Joana Pereira", email: "joana.p@gmail.com", cpf: "656.789.218-69", papel: "Modelo" },
  { nome: "Juliana Martins", email: "juliana.martins@senac.br", cpf: "738.442.615-82", papel: "Aluno" },
  { nome: "Luiza Fernandes", email: "luiza.f@gmail.com", cpf: "617.093.552-64", papel: "Modelo" },
  { nome: "Mariana Alves", email: "model@senac.br", cpf: "126.554.907-30", papel: "Modelo" },
  { nome: "Patrícia Gomes", email: "patricia.gomes@gmail.com", cpf: "345.876.120-09", papel: "Modelo" },
  { nome: "Profa. Helena Duarte", email: "admin@senac.br", cpf: "321.854.067-09", papel: "Administrador", voce: true },
  { nome: "Rafael Souza", email: "rafael.souza@senac.br", cpf: "264.987.381-55", papel: "Aluno" },
  { nome: "Roberto Nunes", email: "roberto.nunes@gmail.com", cpf: "478.392.661-26", papel: "Modelo" }
];

// Filtro selecionado atualmente (padrão é "Todos")
let filtroAtual = "Todos";

// 2. FUNÇÃO QUE DESENHA A TABELA NA TELA
function renderizarTabela() {
  const corpoTabela = document.getElementById("userTable");
  const termoBusca = document.getElementById("searchInput").value.toLowerCase().trim();

  // Filtra os usuários pela busca de texto e pelo botão clicado
  const filtrados = usuarios.filter(function (user) {
    const atendeFiltro = filtroAtual === "Todos" || user.papel === filtroAtual;
    const atendeBusca = (user.nome + " " + user.email + " " + user.cpf).toLowerCase().includes(termoBusca);
    return atendeFiltro && atendeBusca;
  });

  // Monta o HTML das linhas da tabela
  let html = "";
  filtrados.forEach(function (user) {
    // Pega as iniciais do nome para o círculo (ex: "Ana Beatriz" -> "AB")
    const partes = user.nome.split(" ");
    const iniciais = (partes[0][0] + (partes[1] ? partes[1][0] : "")).toUpperCase();
    const avatarCor = user.papel === "Modelo" ? "orange" : "";
    const textoVoce = user.voce ? " <small>(você)</small>" : "";

    // Define a classe CSS de cor de acordo com o papel
    let classePapel = "role-admin";
    if (user.papel === "Modelo") classePapel = "role-modelo";
    if (user.papel === "Aluno") classePapel = "role-aluno";

    html += `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar ${avatarCor}">${iniciais}</div>
            <div>
              <strong>${user.nome}${textoVoce}</strong><br>
              <small style="color: #8492a5;">${user.email}</small>
            </div>
          </div>
        </td>
        <td>${user.cpf}</td>
        <td><span class="role ${classePapel}">${user.papel}</span></td>
        <td>
          <button class="action-button" onclick="alert('Ações para: ${user.nome}')">···</button>
        </td>
      </tr>
    `;
  });

  // Insere as linhas criadas na tabela
  corpoTabela.innerHTML = html;

  // Atualiza mensagem se a busca não encontrar ninguém
  document.getElementById("emptyState").hidden = filtrados.length > 0;

  // Atualiza o rodapé com a contagem exibida
  document.getElementById("tableFooter").textContent = filtrados.length + " de " + usuarios.length + " usuários exibidos";

  // Atualiza os contadores numéricos nos botões de filtro
  document.getElementById("countTodos").textContent = usuarios.length;
  document.getElementById("countModelos").textContent = usuarios.filter(u => u.papel === "Modelo").length;
  document.getElementById("countAlunos").textContent = usuarios.filter(u => u.papel === "Aluno").length;
  document.getElementById("countAdmins").textContent = usuarios.filter(u => u.papel === "Administrador").length;
}

// 3. EVENTO DOS BOTÕES DE FILTRO (Todos, Modelos, Alunos, Admins)
document.querySelectorAll(".filter").forEach(function (botao) {
  botao.addEventListener("click", function () {
    // Remove classe ativo de todos e marca o clicado
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    botao.classList.add("active");

    // Aplica o novo filtro e atualiza a tabela
    filtroAtual = botao.dataset.filter;
    renderizarTabela();
  });
});

// 4. EVENTO DO CAMPO DE BUSCA (filtra enquanto digita)
document.getElementById("searchInput").addEventListener("input", renderizarTabela);

// 5. BOTÃO DE SAIR (LOGOUT)
const botaoLogout = document.querySelector(".logout");
if (botaoLogout) {
  botaoLogout.addEventListener("click", function () {
    if (confirm("Deseja sair do sistema e voltar ao login?")) {
      window.location.href = "../login/index.html";
    }
  });
}

// Carrega a tabela assim que o arquivo é lido
renderizarTabela();
