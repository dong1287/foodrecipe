const API_KEY = "49b530dd0d9541e78744";
const URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/1/100`;

const result = document.getElementById("result");

// 🍜 음식 이름 검색
document.getElementById("nameBtn").addEventListener("click", () => {
  const keyword = document.getElementById("nameInput").value;
  fetchData(keyword, "name");
});

// 🥬 재료 검색
document.getElementById("ingredientBtn").addEventListener("click", () => {
  const keyword = document.getElementById("ingredientInput").value;
  fetchData(keyword, "ingredient");
});

// 📡 API 호출
function fetchData(keyword, type) {
  const category = document.getElementById("categorySelect").value;

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      if (!data.COOKRCP01) {
        result.innerHTML = "데이터를 가져오지 못했습니다.";
        return;
      }

      const recipes = data.COOKRCP01.row;

      let filtered = recipes;

      // 1️⃣ 이름 / 재료 필터
      if (keyword) {
        if (type === "name") {
          filtered = filtered.filter(r => r.RCP_NM.includes(keyword));
        } else {
          filtered = filtered.filter(r => r.RCP_PARTS_DTLS.includes(keyword));
        }
      }

      // 2️⃣ 요리 종류 필터
      if (category) {
        filtered = filtered.filter(r => r.RCP_PAT2.includes(category));
      }

      renderRecipes(filtered);
    })
    .catch(err => {
      console.error(err);
      result.innerHTML = "에러 발생 😢";
    });
}

// 🎨 화면 출력
function renderRecipes(recipes) {
  result.innerHTML = "";

  if (recipes.length === 0) {
    result.innerHTML = "<p>검색 결과 없음 😢</p>";
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    let steps = "";
    for (let i = 1; i <= 20; i++) {
      const step = recipe[`MANUAL${String(i).padStart(2, "0")}`];
      if (step) {
        steps += `<p>${i}. ${step}</p>`;
      }
    }

    card.innerHTML = `
      <div class="recipe-title">${recipe.RCP_NM}</div>

      <div class="recipe-category">
        🍽 ${recipe.RCP_PAT2}
      </div>

      <img class="recipe-img" src="${recipe.ATT_FILE_NO_MAIN}" />

      <div class="recipe-section">
        <strong>재료</strong>
        <p>${recipe.RCP_PARTS_DTLS}</p>
      </div>

      <div class="recipe-section">
        <strong>조리법</strong>
        ${steps}
      </div>

      ${recipe.RCP_NA_TIP ? `
        <div class="recipe-tip">
          💡 ${recipe.RCP_NA_TIP}
        </div>
      ` : ""}
    `;

    result.appendChild(card);
  });
}