const userData = JSON.parse(sessionStorage.getItem("userInfo"));

const adminConfirm = () => {
  if (!userData) {
    window.location.href = "/login";
  }
  if (userData.type_user !== "admin") {
    window.location.href = "/login";
  }
};

adminConfirm();

const fetchCandidates = async () => {
  try {
    const response = await fetch("http://localhost:8000/candidato/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error al obtener candidatos:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
};

const fetchLists = async () => {
  try {
    const response = await fetch("http://localhost:8000/lista/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error en la solicitud: ", error);
    return [];
  }
};

const fetchElections = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:8000/eleccion/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error en la solicitud: ", error);
    return [];
  }
};

const renderCandidates = async () => {
  const candidates = await fetchCandidates();
  const tableBody = document.getElementById("candidates-table-body");

  if (candidates.length > 0) {
    tableBody.innerHTML = candidates
      .map(
        (candidate) => `
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td class="px-6 py-4">${candidate.candidato.nombres}</td>
              <td class="px-6 py-4">${candidate.candidato.apellido_paterno}</td>
              <td class="px-6 py-4">${candidate.candidato.apellido_materno}</td>
              <td class="px-6 py-4">${candidate.nombre_lista}</td>
            </tr>
          `,
      )
      .join("");
  } else {
    tableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center">No hay candidatos disponibles.</td>
          </tr>
        `;
  }
};

const renderList = async () => {
  const lists = await fetchLists();
  const tableBody = document.getElementById("list-table-body");

  if (lists.length > 0) {
    tableBody.innerHTML = lists
      .map(
        (lista) =>
          `<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"> 
                    <td class="px-6 py-4">${lista.nombre}</td>
                    <td class="px-6 py-4">${lista.id_eleccion}</td>
                    <td class="px-6 py-4">${lista.propuesta}</td>
                    <td class="px-6 py-4">${lista.id}</td> 
            </tr>`,
      )
      .join("");
  } else {
    tableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center">No hay listas disponibles.</td>
          </tr>
        `;
  }
};

const renderElections = async () => {
  const elections = await fetchElections();
  const tableBody = document.getElementById("electios-table-body");

  if (elections.length > 0) {
    tableBody.innerHTML = elections
      .map(
        (elec) => `
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td class="px-6 py-4">${elec.fecha}</td>
              <td class="px-6 py-4">${elec.hora_inicio}</td>
              <td class="px-6 py-4">${elec.hora_fin}</td>
              <td class="px-6 py-4">${elec.descripcion}</td>
            </tr>
          `,
      )
      .join("");
  } else {
    tableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center">No hay elecciones disponibles.</td>
          </tr>
        `;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tablinks");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      openTab(tabName);
    });
  });

  renderCandidates();
  renderList();
  renderElections();
});

function openTab(tabName) {
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.add("hidden");
  }

  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.remove("hidden");
  const activeButton = Array.from(tablinks).find(
    (link) => link.getAttribute("data-tab") === tabName,
  );
  if (activeButton) {
    activeButton.classList.add("focus:outline-none");
  }
}
