const members = [
  { name: "華", price: 1550 },
  { name: "チカちゃん", price: 2750 },
  { name: "ブランくん", price: 1550 },
  { name: "ろあちゃん", price: 2750 },
  { name: "バニラちゃん", price: 2750 },
];

let status = JSON.parse(localStorage.getItem("bbq_status")) || {};

function save() {
  localStorage.setItem("bbq_status", JSON.stringify(status));
}

function updateSummary() {
  let total = 0;

  members.forEach(m => {
    if (status[m.name]) total += m.price;
  });

  document.getElementById("summary").innerText =
    "受取済み：" + total.toLocaleString() + "円";
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  members.forEach(m => {
    const paid = status[m.name] || false;

    const card = document.createElement("div");
    card.className = "card " + (paid ? "paid" : "unpaid");

    card.innerHTML = `
      <div class="info">
        <div class="name">${m.name}</div>
        <div class="price">${m.price}円</div>
      </div>

      <button class="${paid ? "btn-paid" : "btn-unpaid"}">
        ${paid ? "支払い済み（長押しで戻す）" : "未払い"}
      </button>
    `;

    const btn = card.querySelector("button");

    // 未払い → 支払い済み（タップ）
    if (!paid) {
      btn.onclick = () => {
        status[m.name] = true;
        save();
        render();
        updateSummary();
      };
    }

    // 支払い済み → 未払い（長押し）
    if (paid) {
      let pressTimer;

      btn.onmousedown = () => {
        pressTimer = setTimeout(() => {
          status[m.name] = false;
          save();
          render();
          updateSummary();
        }, 1000); // 1秒長押し
      };

      btn.onmouseup = () => clearTimeout(pressTimer);
      btn.onmouseleave = () => clearTimeout(pressTimer);

      // スマホ対応
      btn.ontouchstart = () => {
        pressTimer = setTimeout(() => {
          status[m.name] = false;
          save();
          render();
          updateSummary();
        }, 1000);
      };

      btn.ontouchend = () => clearTimeout(pressTimer);
    }

    list.appendChild(card);
  });

  updateSummary();
}

render();
