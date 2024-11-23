// script.js
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll(".section");

    // Navegação por seções
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            window.scrollTo({
                top: target.offsetTop - 50, // Compensa o header
                behavior: "smooth",
            });
        });
    });

    // Manipulação do formulário
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        formMessage.textContent = "Mensagem enviada com sucesso!";
        formMessage.style.color = "green";

        // Limpar o formulário
        form.reset();
    });
});
