const uploadBtn = document.querySelector("#show-upload-form");
const uploadBtnContainer = document.querySelector("#upload-btn-container");
const form = document.querySelector(".upload");

uploadBtn.addEventListener("click", () => {
  form.classList.remove("d-none");
  uploadBtnContainer.classList.add("d-none");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const content = e.target.content.value;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  const imageUrl = document.querySelector("#image").files[0];
  if (imageUrl) {
    formData.append("image", imageUrl);
  }

  await addCard(formData);

  form.reset();
  form.classList.add("d-none");
  uploadBtnContainer.classList.remove("d-none");
});

const addCard = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/api/cards", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return console.error("Failed to add card");
    }
    const data = await response.json();
    alert("card added suessfully");
  } catch (error) {
    console.error("error for showAllCards", error);
  }
};

///////////
const cardsContainer = document.querySelector(".cards_container");

function createCard(el) {
  const card = document.createElement("div");
  card.innerHTML = `<div class="col">
              <div class="card">
                <img src=${el.image} class="card-img-top" alt="">
                <div class="card-body">
                  <h5 class="card-title">${el.title}</h5>
                  <p class="card-text">${el.content}</p>
                </div>
                <div class="button-container">
                <a class="download-btn text-decoration-none bg-dark text-white" href="${el.image}"  download="${el.title}-image"><i class="bi bi-cloud-arrow-down-fill me-1"></i>Download</a>
                <button class="delete-btn" id=${el.id}><i class="bi bi-trash-fill me-1"></i>Button</button>
                </div>
              </div>
            </div>`;
  cardsContainer.append(card);
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    const parentElement = e.target.parentElement.parentElement;
    parentElement.remove();
    deleteCard(el, e);
  });
}

const deleteCard = async (el, e) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cards/${el.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return console.error("failed to delete card");
    }
    const card = e.target;

    card.remove();
    alert("card deleted sucsessfully");
  } catch (error) {
    console.error("error for deleting card", error);
  }
};

const getCards = async () => {
  try {
    const cards = await fetch("http://localhost:3000/api/cards");
    const data = await cards.json();
    if (!data || data.length === 0) {
      return console.error("Not Found any card");
    }
    return data;
  } catch (error) {
    console.error("error for get cards", error);
  }
};

const showAllCards = async () => {
  try {
    const data = await getCards();
    data.forEach((el) => {
      createCard(el);
    });
  } catch (error) {
    console.error("error for showAllCards", error);
  }
};

// showAllCards();
////////////
// pagination

let page = 1;
const cardsPerPage = 3;
const loadMoreButton = document.querySelector("#load");
async function loadCards() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/cards?limit=${cardsPerPage}&page=${page}`
    );
    const paginatedCards = await response.json();

    if (paginatedCards.msg === "No Cards Found") {
      console.log("No more cards to load.");
      loadMoreButton.style.display = "none";
      return;
    }

    paginatedCards.forEach((card) => createCard(card));

    page += 1;
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}
loadMoreButton.addEventListener("click", loadCards);
loadCards();
/////////
const searchInput = document.querySelector("#search");

searchInput.addEventListener("keyup", search);

async function search(e) {
  try {
    page = 2;
    let pageNum = 1;
    const inputValue = e.target.value.toLowerCase().trim();
    const cards = await getCards();
    const filteredCards = cards.filter((el) =>
      el.title.toLowerCase().trim().startsWith(inputValue)
    );

    if (inputValue === "") {
      cardsContainer.innerHTML = "";
      const response = await fetch(
        `http://localhost:3000/api/cards?limit=${cardsPerPage}&page=${pageNum}`
      );
      const paginatedCards = await response.json();
      paginatedCards.forEach((card) => {
        createCard(card);
      });
      loadMoreButton.style.display = "block";
      return;
    }

    if (filteredCards.length === 0) {
      cardsContainer.innerHTML = "<p>Not Found</p>";
      loadMoreButton.style.display = "none";
      return;
    }

    cardsContainer.innerHTML = "";
    filteredCards.forEach((card) => {
      createCard(card);
    });
  } catch (error) {
    console.log(error);
  }
}
