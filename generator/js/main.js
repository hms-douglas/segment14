const PROJECT_URL = "https://github.com/hms-douglas/segment14",
      FONTS_DOWNLOAD_URL = PROJECT_URL + "/tree/master/TTFs/Segment14.ttf",
      EL_CONTAINER_CHARS = document.getElementById("containerChars"),
      EL_CONTAINER_COLORPICKER = document.getElementById("colorPicker"),
      EL_CONTAINER_SETTINGS = document.getElementById("containerSettings"),
      EL_INPUT_COLORPICKER = document.getElementById("color"),
      EL_INPUT_HEIGHT = document.getElementById("png_height"),
      EL_INPUT_WIDTH = document.getElementById("png_width"),
      EL_POPUP_LOADING = document.getElementById("LOADING"),
      EL_LOADER_PROGRESS = document.querySelector("#PROGRESS div");

let R9_COLOR_PICKER;

let AMOUNT_TO_GENERATE = 0,
    AMOUNT_GENERATED = 0;

let PNG_ZIP,
    PNG_HEIGHT = SVG_VIEW_HEIGHT,
    PNG_WIDTH = SVG_VIEW_WIDTH;  

window.onload = () => {
    calculateAmountToGenerate();

    renderChars();

    initColorPicker();

    initInputsValues();

    initListeners();
};

function initListeners() {
    EL_INPUT_COLORPICKER.addEventListener("click", (ev) => {
        COLORPICKER_show(ev);
    });

    EL_INPUT_HEIGHT.addEventListener("keyup", () => PNG_onSizeChange(true));
    EL_INPUT_WIDTH.addEventListener("keyup", () => PNG_onSizeChange(false));

    document.getElementById("generateSvg").addEventListener("click", () => SVG_generateZip());

    document.getElementById("generatePng").addEventListener("click", () => PNG_generateZip());

    document.getElementById("showBase").addEventListener("change", () => {
        EL_CONTAINER_CHARS.classList.toggle("hideBase");
    })

    document.getElementById("downloadTtf").addEventListener("click", () => {
        window.open(FONTS_DOWNLOAD_URL, "_black");
    });

    document.getElementById("projectGithub").addEventListener("click", () => {
        window.open(PROJECT_URL, "_black");
    });
}

function initInputsValues() {
    EL_INPUT_HEIGHT.value = PNG_HEIGHT;
    EL_INPUT_WIDTH.value = PNG_WIDTH;

    COLORPICKER_setInputColor("#000000FF");
}

function initColorPicker() {
    if(window.innerWidth < 850) {
        R9_COLOR_PICKER = new R9Picker(EL_CONTAINER_COLORPICKER.id, R9Picker.TYPE.BASIC);
        R9_COLOR_PICKER.SIZE = window.innerWidth / 2.2;

        R9_COLOR_PICKER.addEventListener(R9Picker.EVENT.PICKING_END, (data) => {
            COLORPICKER_setColorPicked(data.hex);
        });

    } else {
        R9_COLOR_PICKER = new R9Picker(EL_CONTAINER_COLORPICKER.id, R9Picker.TYPE.COMPLETE);
        R9_COLOR_PICKER.SIZE = 209;
    }

    R9_COLOR_PICKER.setDarkMode(false);

    R9_COLOR_PICKER.addPalette(R9Picker.PALETTE.MATERIAL_DESIGN);
    R9_COLOR_PICKER.addPalette(R9Picker.PALETTE.CLASSIC);
    R9_COLOR_PICKER.addPalette(R9Picker.PALETTE.HUE_24);

    R9_COLOR_PICKER.addEventListener(R9Picker.EVENT.TAB_CHANGE, (tab) => {
        R9_COLOR_PICKER.showColorNameOnPalette(tab === R9Picker.TAB.SAVED);
    });

    R9_COLOR_PICKER.addEventListener(R9Picker.EVENT.SET, (data) => {
        COLORPICKER_setColorPicked(data.current.hex);
    });

    R9_COLOR_PICKER.addEventListener(R9Picker.EVENT.CANCELED, () => {
        COLORPICKER_hide();
    });
}

function COLORPICKER_hide() {
    EL_CONTAINER_COLORPICKER.style.display = "none";
}

function COLORPICKER_show(ev) {
    R9_COLOR_PICKER.COLOR = EL_INPUT_COLORPICKER.value;

    EL_CONTAINER_COLORPICKER.style.display = "block";

    const y = ev.clientY + EL_CONTAINER_SETTINGS.scrollTop;
    
    if((EL_CONTAINER_COLORPICKER.clientHeight + ev.clientY) > window.innerHeight) {
        EL_CONTAINER_COLORPICKER.style.top = (y - EL_CONTAINER_COLORPICKER.clientHeight) + "px";
    } else {
        EL_CONTAINER_COLORPICKER.style.top = y + "px";
    }

    if(window.innerWidth > 850) {
        if((EL_CONTAINER_COLORPICKER.getBoundingClientRect().width + ev.clientX) > window.innerWidth) {
            EL_CONTAINER_COLORPICKER.style.left = (ev.clientX - EL_CONTAINER_COLORPICKER.clientWidth) + "px";
        } else {
            EL_CONTAINER_COLORPICKER.style.left = ev.clientX + "px";
        }
    }
}

function COLORPICKER_setColorPicked(hex) {
    COLORPICKER_setInputColor(hex);

    COLORPICKER_hide();

    SVG_setColor(hex);

    renderChars();
}

function COLORPICKER_setInputColor(hex) {
    EL_INPUT_COLORPICKER.value = hex;
    EL_INPUT_COLORPICKER.style.backgroundColor = hex;
    EL_INPUT_COLORPICKER.style.color = R9.constrastRatio(hex, "#030303", R9.WCAG.AA_NORMAL) ? "#030303" : "#F3F3F3";
}

function calculateAmountToGenerate() {
    AMOUNT_TO_GENERATE = 0;

    AMOUNT_TO_GENERATE += Object.keys(SEGMENTS_CONTAINER).length;
    AMOUNT_TO_GENERATE += Object.keys(SEGMENTS_NUMBERS).length;
    AMOUNT_TO_GENERATE += Object.keys(SEGMENTS_LETTERS_LOWER).length;
    AMOUNT_TO_GENERATE += Object.keys(SEGMENTS_LETTERS_UPPER).length;
    AMOUNT_TO_GENERATE += Object.keys(SEGMENTS_SYMBOLS).length;

    AMOUNT_TO_GENERATE += 1; //Colon
}

function renderChars() {
    EL_CONTAINER_CHARS.innerHTML = "";

    AMOUNT_GENERATED = 0;

    addChars(ZIP_FOLDER_NAME_NUMBERS, SEGMENTS_NUMBERS);
    addChars(ZIP_FOLDER_NAME_LETTERS + " - " + ZIP_SUB_FOLDER_NAME_UPPER, SEGMENTS_LETTERS_UPPER);
    addChars(ZIP_FOLDER_NAME_LETTERS + " - " + ZIP_SUB_FOLDER_NAME_LOWER, SEGMENTS_LETTERS_LOWER);
    addChars(ZIP_FOLDER_NAME_SYMBOLS, SEGMENTS_SYMBOLS);
    addColon();
}

function addChars(name, segments) {
    const charGroup = document.createElement("div");

    charGroup.className = "charGroup";
    
    const charGroupName = document.createElement("span");

    charGroupName.innerHTML = name;

    charGroup.appendChild(charGroupName);

    for(const key in segments) {
        addChar(charGroup, key, segments[key]);
    }

    EL_CONTAINER_CHARS.appendChild(charGroup);
}

function addChar(group, name, segment) {
    const svg = SVG_generateSvgString(segment);

    const svgBlob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});

    const url = URL.createObjectURL(svgBlob);

    const imageContainer = document.createElement("div");

    imageContainer.className = "charContainer";

    const image = new Image();

    image.height = SVG_VIEW_HEIGHT;
    image.width = SVG_VIEW_WIDTH;

    image.src = url;

    imageContainer.appendChild(image);

    const imageName = document.createElement("span");

    imageName.innerHTML = name.replaceAll("_", " ");

    imageContainer.appendChild(imageName);

    group.appendChild(imageContainer);
}

function addColon() {
    const svg = SVG_getSVGColonString();

    const svgBlob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});

    const url = URL.createObjectURL(svgBlob);

    const imageContainer = document.createElement("div");

    imageContainer.className = "charContainer charContainer--colon";

    const image = new Image();

    image.height = SVG_VIEW_HEIGHT;
    image.width = SVG_COLON_VIEW_WIDTH;

    image.src = url;

    imageContainer.appendChild(image);

    const imageName = document.createElement("span");

    imageName.innerHTML = ITEM_COLON_NAME;

    imageContainer.appendChild(imageName);

    document.querySelector(".charGroup:last-of-type").appendChild(imageContainer);
}

function SVG_generateZip() {
    LOADING_show();

    const zip = new JSZip();

    SVG_generateFolder(zip, ZIP_FOLDER_NAME_CONTAINERS, SEGMENTS_CONTAINER);
    SVG_generateFolder(zip, ZIP_FOLDER_NAME_NUMBERS, SEGMENTS_NUMBERS);
    SVG_generateFolder(zip, ZIP_FOLDER_NAME_SYMBOLS, SEGMENTS_SYMBOLS);

    const letters = zip.folder(ZIP_FOLDER_NAME_LETTERS);

    SVG_generateFolder(letters, ZIP_SUB_FOLDER_NAME_LOWER, SEGMENTS_LETTERS_LOWER);
    SVG_generateFolder(letters, ZIP_SUB_FOLDER_NAME_UPPER, SEGMENTS_LETTERS_UPPER);

    zip.generateAsync({type : "blob"}).then((blob) => {
        ZIP_triggerDownload("SVG", blob);

        LOADING_hide();
    });
}

function SVG_generateFolder(parent, folderName, items) {
    const folder = parent.folder(folderName);

    for(const key in items) {
        folder.file(key + ".svg", SVG_generateSvgString(items[key]));

        AMOUNT_GENERATED++;

        LOADING_incrementProgress();
    }

    if(folderName == ZIP_FOLDER_NAME_SYMBOLS) {
        folder.file(ITEM_COLON_NAME + ".svg", SVG_getSVGColonString());

        AMOUNT_GENERATED++;

        LOADING_incrementProgress();
    }
    
    return folder
}

function PNG_generateZip() {
    LOADING_show();
    
    AMOUNT_GENERATED = 0;

    PNG_ZIP = new JSZip();

    PNG_generateFolder(PNG_ZIP, ZIP_FOLDER_NAME_CONTAINERS, SEGMENTS_CONTAINER);

    PNG_generateFolder(PNG_ZIP, ZIP_FOLDER_NAME_NUMBERS, SEGMENTS_NUMBERS);
    PNG_generateFolder(PNG_ZIP, ZIP_FOLDER_NAME_SYMBOLS, SEGMENTS_SYMBOLS);

    const letters = PNG_ZIP.folder(ZIP_FOLDER_NAME_LETTERS);

    PNG_generateFolder(letters, ZIP_SUB_FOLDER_NAME_LOWER, SEGMENTS_LETTERS_LOWER);
    PNG_generateFolder(letters, ZIP_SUB_FOLDER_NAME_UPPER, SEGMENTS_LETTERS_UPPER);
}

function PNG_generateFolder(parent, folderName, items) {
    const folder = parent.folder(folderName);

    for(const key in items) {
        PNG_generateFile(folder, key, items[key])
    }

    if(folderName == ZIP_FOLDER_NAME_SYMBOLS) {
        PNG_generateColonFile(folder);
    }
}

function PNG_generateFile(parent, fileName, segments) {
    const svg = SVG_generateSvgString(segments);

    const svgBlob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});

    const url = URL.createObjectURL(svgBlob);

    const image = new Image();

    if(PNG_HEIGHT <= 0 || PNG_WIDTH <= 0) {
        image.height = SVG_VIEW_HEIGHT;
        image.width = SVG_VIEW_WIDTH;
    } else {
        image.height = PNG_HEIGHT;
        image.width = PNG_WIDTH;
    }

    image.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);

        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
            parent.file(fileName + ".png", blob);

            PNG_imageGenerated();
        })
    };

    image.src = url;
}

function PNG_generateColonFile(parent) {
    const svg = SVG_getSVGColonString();

    const svgBlob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});

    const url = URL.createObjectURL(svgBlob);

    const image = new Image();

    if(PNG_HEIGHT <= 0 || PNG_WIDTH <= 0) {
        image.height = SVG_VIEW_HEIGHT;
        image.width = SVG_COLON_VIEW_WIDTH;
    } else {
        image.height = PNG_HEIGHT;
        image.width = Math.trunc((SVG_COLON_VIEW_WIDTH * PNG_HEIGHT) / SVG_VIEW_HEIGHT);
    }

    image.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);

        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
            parent.file(ITEM_COLON_NAME + ".png", blob);

            PNG_imageGenerated();
        })
    };

    image.src = url;
}

function PNG_imageGenerated() {    
    AMOUNT_GENERATED++;

    LOADING_incrementProgress();

    if(AMOUNT_GENERATED == AMOUNT_TO_GENERATE) {
        PNG_ZIP.generateAsync({type : "blob"}).then((blob) => {
            ZIP_triggerDownload("PNG", blob);

            LOADING_hide();
        });
    }
}

function PNG_onSizeChange(heightChanged) {
    if(heightChanged) {
        PNG_WIDTH = Math.trunc((SVG_VIEW_WIDTH * EL_INPUT_HEIGHT.value) / SVG_VIEW_HEIGHT);
        PNG_HEIGHT = EL_INPUT_HEIGHT.value;

        EL_INPUT_WIDTH.value = PNG_WIDTH;
    } else {
        PNG_WIDTH = EL_INPUT_WIDTH.value;
        PNG_HEIGHT = Math.trunc((SVG_VIEW_HEIGHT * EL_INPUT_WIDTH.value) / SVG_VIEW_WIDTH);

        EL_INPUT_HEIGHT.value = PNG_HEIGHT;
    }
}

function LOADING_show() {
    LOADING_resetProgress();

    EL_POPUP_LOADING.style.display = "block";

    setTimeout(() => {
       EL_POPUP_LOADING.classList.add("show");
    }, 20);
}

function LOADING_hide() {
    EL_POPUP_LOADING.classList.remove("show");

    setTimeout(() => {
        EL_POPUP_LOADING.style.display = "none";
    }, 250);
}

function LOADING_incrementProgress() {
    EL_LOADER_PROGRESS.style.width = ((AMOUNT_GENERATED * 100) / AMOUNT_TO_GENERATE) + "%";
}

function LOADING_resetProgress() {
    EL_LOADER_PROGRESS.style.width = "0%";
}
