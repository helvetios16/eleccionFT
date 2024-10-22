// Función para manejar el envío del formulario de login
const submitForm = async (event) => {
  event.preventDefault();

  const form = event.target;
  const user = form.elements.user.value.trim();
  const password = form.elements.password.value.trim();

  if (!user || !password) {
    console.error("Username or password cannot be empty.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", user);
  formData.append("password", password);
  formData.append("scope", "");
  formData.append("client_id", "");
  formData.append("client_secret", "");

  try {
    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      return;
    }

    const responseData = await response.json();
    console.log("Login successful");
    form.reset();

    const userData = await getCurrentUser(responseData.access_token);

    if (userData) {
      sessionStorage.setItem("token", responseData.access_token);
      sessionStorage.setItem("userInfo", JSON.stringify(userData));

      if (userData.type_user === "elector") {
        window.location.href = "/home";
      } else {
        window.location.href = "/admin";
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Función para obtener los datos del usuario actual
const getCurrentUser = async (token) => {
  try {
    const response = await fetch(
      `http://localhost:8000/login/?token=${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch current user:", errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching the current user:", error);
    return null;
  }
};

// Iniciar la escucha del evento submit cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  if (form) {
    form.addEventListener("submit", submitForm);
  }
});
