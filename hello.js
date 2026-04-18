
document.addEventListener("input",(event)=>{
    const target = event.target;

    console.log("Content script loaded");

    if(target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") return;

    const typedText = target.value.toLowerCase();
    console.log(target)
    console.log(typedText)

    chrome.storage.local.get(["map"],(result)=>{
        const map  = result.map || {};

        for(let key in map){
            if(typedText === key.toLowerCase()){
                console.log("matched")
                console.log(map[key])
                target.value= map[key];
                target.dispatchEvent(new Event("input", { bubbles: true }));
                break;
            }
        }
    })
})