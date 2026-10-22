const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("error");

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = "Sending…";

  const payload = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    subject: contactForm.subject.value.trim(),
    message: contactForm.message.value.trim(),
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to send your message. Please try again.");
    }

    formStatus.textContent = "Thanks! Your message has been sent successfully.";
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = error.message || "Could not connect. Please try again later.";
    formStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});
