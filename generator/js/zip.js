const ZIP_FOLDER_NAME_CONTAINERS = "Containers",
      ZIP_FOLDER_NAME_NUMBERS = "Numbers",
      ZIP_FOLDER_NAME_LETTERS = "Letters",
      ZIP_SUB_FOLDER_NAME_UPPER = "Upper",
      ZIP_SUB_FOLDER_NAME_LOWER = "Lower",
      ZIP_FOLDER_NAME_SYMBOLS = "Symbols",
      ITEM_COLON_NAME = "colon";

function ZIP_triggerDownload(type, blob) {
    const a = document.createElement("a");

    a.download = "Segment14 - " + type + ".zip";
    a.href = URL.createObjectURL(blob);

    document.body.appendChild(a);

    a.click();

    a.remove();
}