// ===============================
// CADASTRO.JS — MEU BICHO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const botoesTipo = document.querySelectorAll(".btn-tipo");
  const camposPF = document.getElementById("camposPF");
  const camposONG = document.getElementById("camposONG");
  const msg = document.getElementById("msgRetorno");
  const form = document.getElementById("formCadastro");

  // ===== Campos Adotante =====
  const cepPF = document.getElementById("cep");
  const enderecoPF = document.getElementById("endereco");
  const bairroPF = document.getElementById("bairro");
  const cidadePF = document.getElementById("cidade");
  const estadoPF = document.getElementById("estado");

  // ===== Campos ONG =====
  const cepONG = document.getElementById("cep_ong");
  const enderecoONG = document.getElementById("endereco_ong");
  const bairroONG = document.getElementById("bairro_ong");
  const cidadeONG = document.getElementById("cidade_ong");
  const estadoONG = document.getElementById("estado_ong");

  // ===============================
  // Alternar tipo de conta
  // ===============================
  botoesTipo.forEach((botao) => {
    botao.addEventListener("click", () => {
      botoesTipo.forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      const tipo = botao.dataset.tipo;
      if (tipo === "adotante") {
        camposPF.style.display = "block";
        camposONG.style.display = "none";
      } else {
        camposPF.style.display = "none";
        camposONG.style.display = "block";
      }

      msg.textContent = "";
    });
  });

  // ===============================
  // Função genérica — Buscar CEP (ViaCEP)
  // ===============================
  async function buscarCEP(cepInput, enderecoInput, bairroInput, cidadeInput, estadoInput) {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      msg.textContent = "⚠️ CEP inválido. Digite 8 números.";
      msg.style.color = "#e77e38";
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        msg.textContent = "⚠️ CEP não encontrado. Preencha manualmente.";
        msg.style.color = "#e77e38";
        enderecoInput.removeAttribute("readonly");
        enderecoInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
        return;
      }

      enderecoInput.value = data.logradouro || "";
      bairroInput.value = data.bairro || "";
      cidadeInput.value = data.localidade || "";
      estadoInput.value = data.uf || "";

      if (!data.logradouro) {
        enderecoInput.removeAttribute("readonly");
      } else {
        enderecoInput.setAttribute("readonly", true);
      }

      msg.textContent = "";
    } catch (error) {
      msg.textContent = "❌ Erro ao buscar o CEP.";
      msg.style.color = "red";
    }
  }

  // Eventos para busca de CEP
  cepPF?.addEventListener("blur", () => buscarCEP(cepPF, enderecoPF, bairroPF, cidadePF, estadoPF));
  cepONG?.addEventListener("blur", () => buscarCEP(cepONG, enderecoONG, bairroONG, cidadeONG, estadoONG));

  // ===============================
  // Envio do formulário
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const tipoAtivo = document.querySelector(".btn-tipo.ativo").dataset.tipo;
    let dados = {};

    // ===== Dados de Pessoa Física (Adotante) =====
    if (tipoAtivo === "adotante") {
      dados = {
        tipo: "adotante",
        nome: document.getElementById("nome").value.trim(),
        data_nasc: document.getElementById("data_nasc").value,
        cpf: document.getElementById("cpf").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        cep: cepPF.value.trim(),
        endereco: enderecoPF.value.trim(),
        numero: document.getElementById("numero").value.trim(),
        bairro: bairroPF.value.trim(),
        cidade: cidadePF.value.trim(),
        estado: estadoPF.value.trim(),
      };
    }
    // ===== Dados de ONG =====
    else {
      dados = {
        tipo: "ong",
        nome: document.getElementById("nome_ong").value.trim(),
        cnpj: document.getElementById("cnpj").value.trim(),
        telefone: document.getElementById("telefone_ong").value.trim(),
        email: document.getElementById("email_ong").value.trim(),
        descricao: document.getElementById("descricao_ong").value.trim(),
        instagram: document.getElementById("instagram").value.trim(),
        site: document.getElementById("site").value.trim(),
        logo: document.getElementById("logo").value.trim(),
        senha: document.getElementById("senha_ong").value.trim(),
        cep: cepONG.value.trim(),
        endereco: enderecoONG.value.trim(),
        numero: document.getElementById("numero_ong").value.trim(),
        bairro: bairroONG.value.trim(),
        cidade: cidadeONG.value.trim(),
        estado: estadoONG.value.trim(),
      };
    }

    // ===============================
    // Envio da requisição
    // ===============================
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
        enderecoPF?.removeAttribute("readonly");
        enderecoONG?.removeAttribute("readonly");
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
