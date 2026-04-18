const keyInput = document.getElementById("keyInput");
const valueInput = document.getElementById("valueInput");
const addBtn = document.getElementById("addBtn");
const output = document.getElementById("output");

// Load data when popup opens
document.addEventListener("DOMContentLoaded", loadData);

addBtn.addEventListener("click", () => {
  const key = keyInput.value.trim();
  const value = valueInput.value.trim();
  console.log(chrome)

  if (key === "" || value === "") {
    alert("Please enter both key and value");
    return;
  }

  // Get existing data first
  chrome.storage.local.get(["map"], (result) => {
    let map = result.map || {};

    // Add new value
    map[key] = value;

    // Save back to storage
    chrome.storage.local.set({ map: map }, () => {
      render(map);
    });
  });

  keyInput.value = "";
  valueInput.value = "";
});

function loadData() {
  chrome.storage.local.get(["map"], (result) => {
    const map = result.map || {};
    render(map);
  });
}

function render(map) {
  output.innerHTML = "";

  for (let key in map) {
    const div = document.createElement("div");
    div.textContent = key + " : " + map[key];
    output.appendChild(div);
  }
}