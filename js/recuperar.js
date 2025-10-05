// ==============================
// Recuperação de senha (com redirecionamento)
// ==============================
document.getElementById("formRecuperar").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.style.transition = "opacity 0.3s ease";

  if (!email) {
    msg.style.color = "red";
    msg.textContent = "Por favor, informe seu e-mail.";
    return;
  }

  try {
    // Endpoint de exemplo (ajuste conforme seu backend)
    const response = await fetch("http://localhost:5000/api/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.style.color = "red";
      msg.textContent = data.message || "E-mail não encontrado.";
      return;
    }

    // Mensagem de sucesso + redirecionamento
    msg.style.color = "green";
    msg.innerHTML = "✅ E-mail de recuperação enviado com sucesso!<br>Você será redirecionado em 5 segundos...";
    
    // Contagem regressiva visual (opcional)
    let segundos = 5;
    const intervalo = setInterval(() => {
      segundos--;
      msg.innerHTML = `✅ E-mail de recuperação enviado com sucesso!<br>Você será redirecionado em ${segundos} segundo${segundos > 1 ? 's' : ''}...`;
      if (segundos === 0) {
        clearInterval(intervalo);
        window.location.href = "index.html";
      }
    }, 1000);

  } catch (error) {
    console.error("Erro:", error);
    msg.style.color = "red";
    msg.textContent = "Erro de conexão. Tente novamente mais tarde.";
  }
});
