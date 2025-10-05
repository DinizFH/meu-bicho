document.addEventListener("DOMContentLoaded", () => {
  const botoesTipo = document.querySelectorAll(".btn-tipo");
  const camposPF = document.getElementById("camposPF");
  const camposONG = document.getElementById("camposONG");
  const msg = document.getElementById("msgRetorno");
  const form = document.getElementById("formCadastro");

  botoesTipo.forEach(botao => {
    botao.addEventListener("click", () => {
      botoesTipo.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      const tipo = botao.dataset.tipo;
      if (tipo === "adotante") {
        camposPF.style.display = "block";
        camposONG.style.display = "none";
      } else {
        camposPF.style.display = "none";
        camposONG.style.display = "block";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipoAtivo = document.querySelector(".btn-tipo.ativo").dataset.tipo;
    const telefone = document.getElementById("telefone").value.trim();

    let dados = {};

    if (tipoAtivo === "adotante") {
      dados = {
        tipo: "adotante",
        nome: document.getElementById("nome").value.trim(),
        data_nasc: document.getElementById("data_nasc").value,
        cpf: document.getElementById("cpf").value.trim(),
        telefone,
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
      };
    } else {
      dados = {
        tipo: "ong",
        nome: document.getElementById("nome_ong").value.trim(),
        cnpj: document.getElementById("cnpj").value.trim(),
        telefone,
        email: document.getElementById("email_ong").value.trim(),
        senha: document.getElementById("senha_ong").value.trim(),
      };
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const result = await response.json();

      if (response.ok) {
        msg.textContent = "✅ Cadastro realizado com sucesso!";
        msg.style.color = "green";
        form.reset();
      } else {
        msg.textContent = "❌ " + (result.error || "Erro ao cadastrar.");
        msg.style.color = "red";
      }
    } catch (error) {
      msg.textContent = "❌ Falha de conexão com o servidor.";
      msg.style.color = "red";
    }
  });
});
