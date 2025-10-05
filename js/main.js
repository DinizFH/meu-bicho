// ==============================
// LOGIN COM JWT (pronto para backend)
// ==============================
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  if (!email || !senha) {
    msg.style.color = "red";
    msg.textContent = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.style.color = "red";
      msg.textContent = data.message || "Email ou senha inválidos.";
      return;
    }

    // Armazena o token JWT
    localStorage.setItem("token", data.token);

    msg.style.color = "green";
    msg.textContent = "Login realizado com sucesso!";

    setTimeout(() => {
      window.location.href = "dashboard.html"; // redireciona para próxima página
    }, 1000);
  } catch (error) {
    console.error("Erro ao logar:", error);
    msg.style.color = "red";
    msg.textContent = "Erro de conexão. Tente novamente mais tarde.";
  }
});
