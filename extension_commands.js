let d = document.getElementById("demo");
let b = document.getElementById("brightness");
let vb = document.getElementById("value_brightness")
let w = document.getElementById("width");
let vw = document.getElementById("value_width")
let fs = document.getElementById("fsize");
let vfs = document.getElementById("value_fsize")
let c = document.getElementById("fcolor");
let vc = document.getElementById("value_fcolor")
let bg = document.getElementById("background");
let vbg = document.getElementById("value_background")



document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['savedStyles'], (result) => {
        if (result.savedStyles) {
            const saved = result.savedStyles;
            d.style.color = saved.color;
            if (c) {
                c.value = rgbToHex(saved.color);
                vc.innerHTML = c.value;
            }
            d.style.fontFamily = saved.fontFamily;
            d.style.fontSize = saved.fontSize;
            if (fs) {
                fs.value = parseInt(saved.fontSize);
                vfs.innerHTML = fs.value;
            }
            d.style.width = saved.width;
            if (w) {
                w.value = parseInt(saved.width);
                vw.innerHTML = w.value + "%";
            }
            d.style.filter = saved.filter;
            if (saved.filter) {
                let brightnessValue = saved.filter.match(/\d+/);
                if (brightnessValue && b) {
                    b.value = parseInt(brightnessValue[0]);
                    vb.innerHTML=b.value+"%"
                }
            }
            d.style.backgroundColor = saved.backgroundColor;
            if (bg) {bg.value = rgbToHex(saved.backgroundColor);
            vbg.innerHTML=bg.value;}
        }
    });
});

document.getElementById("set").addEventListener("click", () => {
    const styleData = {
        color: d.style.color,
        fontFamily: d.style.fontFamily,
        fontSize: d.style.fontSize,
        width: d.style.width,
        filter: d.style.filter,
        backgroundColor: d.style.backgroundColor
    };

    chrome.storage.sync.set({ savedStyles: styleData });

    chrome.tabs.query({ active: true, currentWindow: true })
        .then(([tab]) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: setMode,
                args: [styleData]
            });
        });
});

function setMode(styles) {
    if (!document.getElementById("my-extension-font")) {
        let link = document.createElement("link");
        link.id = "my-extension-font";
        link.href = "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Quicksand:wght@300..700&display=swap"; //change to include combo of all available fonts
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    // 2. Your existing logic
    let x = document.getElementById("main");
    let y = document.getElementsByClassName("wrapper");
    let z = document.getElementById("feedback");
    let change = document.getElementById("workskin");

    if (x) x.style.backgroundColor = styles.backgroundColor;

    if (change) {
        change.style.color = styles.color;
        change.style.fontFamily = styles.fontFamily;
        change.style.fontSize = styles.fontSize;
        change.style.width = styles.width;
        change.style.filter = styles.filter;
    }

    if (y && y[2]) y[2].style.backgroundColor = "white";
    if (z) z.style.backgroundColor = "white";
}


function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb;

    const separator = rgb.indexOf(",") > -1 ? "," : " ";
    const rgbValues = rgb.substr(4).split(")")[0].split(separator);

    let r = (+rgbValues[0]).toString(16).padStart(2, '0');
    let g = (+rgbValues[1]).toString(16).padStart(2, '0');
    let b = (+rgbValues[2]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}