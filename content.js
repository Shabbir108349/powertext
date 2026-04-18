let currentSuggestion = null;

// 🔹 1. Safe input setter (works on React / modern sites)
function setInputValue(element, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
        element instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype,
        "value"
    ).set;

    nativeSetter.call(element, value);

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
}

// 🔹 2. Reset state helper (IMPORTANT FIX)
function resetState() {
    currentSuggestion = null;
}

// 🔹 3. Focus detection (re-initialize properly every time)
document.addEventListener("focusin", (event) => {
    const target = event.target;

    if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") return;

    resetState();
    attachSuggestionBox(target);
});

// 🔹 4. Main suggestion box logic
function attachSuggestionBox(input) {

    // remove old boxes
    document.querySelectorAll(".my-suggestion-box").forEach(e => e.remove());

    let box = document.createElement("div");
    box.classList.add("my-suggestion-box");

    // 🎨 UI styling
    box.style.position = "absolute";
    box.style.background = "#fff";
    box.style.border = "1px solid #ddd";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
    box.style.zIndex = "999999";
    box.style.fontSize = "14px";
    box.style.color = "#222";
    box.style.maxHeight = "180px";
    box.style.overflowY = "auto";
    box.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(box);

    // 🔹 update suggestions
    function updateSuggestions() {

        chrome.storage.local.get(["map"], (result) => {
            const map = result.map || {};
            const value = input.value.toLowerCase();

            box.innerHTML = "";
            currentSuggestion = null;

            if (!value) return;

            for (let key in map) {
                if (key.toLowerCase().includes(value)) {

                    currentSuggestion = map[key];

                    let item = document.createElement("div");

                    // highlight key
                    item.innerHTML = `<strong>${key}</strong> → ${map[key]}`;

                    item.style.padding = "8px";
                    item.style.cursor = "pointer";

                    // hover effect
                    item.addEventListener("mouseenter", () => {
                        item.style.background = "#f3f3f3";
                    });

                    item.addEventListener("mouseleave", () => {
                        item.style.background = "transparent";
                    });

                    // click selection
                    item.onclick = () => {
                        setInputValue(input, map[key]);
                        box.remove();
                        resetState(); // 🔥 FIX
                    };

                    box.appendChild(item);
                }
            }

            if (box.innerHTML === "") {
                box.style.display = "none";
            } else {
                box.style.display = "block";
            }
        });
    }

    // 🔹 safe binding (fixes broken re-render issues)
    input.oninput = updateSuggestions;

    // 🔹 TAB autofill (FIXED)
    input.addEventListener("keydown", (event) => {
        if (event.key === "Tab" && currentSuggestion) {
            event.preventDefault();

            setInputValue(input, currentSuggestion);

            // box.remove();
            resetState(); // 🔥 FIX
        }
    });

    // 🔹 position box
    function positionBox() {
        const rect = input.getBoundingClientRect();

        box.style.left = rect.left + window.scrollX + "px";
        box.style.top = rect.bottom + window.scrollY + "px";
        box.style.width = rect.width + "px";
    }

    positionBox();

    window.addEventListener("scroll", positionBox);
    window.addEventListener("resize", positionBox);

    // 🔹 remove on outside click
    document.addEventListener("click", (e) => {
        if (e.target !== input && !box.contains(e.target)) {
            // box.remove();
            resetState(); // 🔥 FIX
        }
    });
}