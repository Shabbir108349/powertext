const keyInput = document.getElementById('keyInput')
const valueInput = document.getElementById('valueInput')
const addBtn = document.getElementById("addBtn")
const search = document.getElementById('search')
const list = document.getElementById('output')
const count = document.getElementById('count')

console.log("shabbir")

document.addEventListener("DOMContentLoaded", loadData);

addBtn.addEventListener("click", () => {
    console.log('hello')
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
    list.innerHTML = "";

    let noOfItem = 0;

    for (let key in map) {
        noOfItem++
        const div = document.createElement("div");
        div.innerHTML = `
          <div class="meta">
            <div class="key">${key} <span class="chip">snippet</span></div>
            <div class="value">${map[key]}</div>
          </div>
          <div class="actions">
            <button class="icon-btn copy">Copy</button>
            <button class="icon-btn delete">Delete</button>
          </div>
        `;

        const copyBtn = div.querySelector(".copy")
        const deleteBtn = div.querySelector(".delete")

        copyBtn.addEventListener("click", () => {
            copyValue(key);
        })

        deleteBtn.addEventListener("click", () => {
            removeKey(key);
        })

        list.appendChild(div);
    }
    count.textContent = noOfItem + ' snippets';

}


function removeKey(key) {
    chrome.storage.local.get(["map"], (result) => {
        let map = result.map || {};

        delete map[key]; // remove key

        chrome.storage.local.set({ map: map });
        render(map);
    });

}

function copyValue(key) {
    chrome.storage.local.get(["map"], (result) => {
        let map = result.map || {};

        navigator.clipboard.writeText(map[key]);
    });

}


const searchInput = document.getElementById('search');

searchInput.addEventListener('input',searchingSnippet)

function searchingSnippet() {
    const query = searchInput.value.toLowerCase();
    console.log(query)

    chrome.storage.local.get(["map"], (result) => {
        const map = result.map || {};

        if (!query) {
            render(map);
            return;
        }

        let filteredMap = {};

        for (let key in map) {
            if (
                key.toLowerCase().includes(query) ||
                map[key].toLowerCase().includes(query)
            ) {
                filteredMap[key] = map[key];
            }
        }

        render(filteredMap);
    });
}

