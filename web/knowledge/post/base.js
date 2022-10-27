function MarkdownConverter(domIn, domOut, headerLevelStart = 3) {
  const converter = new showdown.Converter({
    noHeaderId: true,
    headerLevelStart: headerLevelStart,
  });
  function convert() {
    const md = domIn.value ? domIn.value : domIn.placeholder;
    const html = converter.makeHtml(md);
    domOut.innerHTML = html;
  }

  return {
    convert: convert,
  };
}

const converter = MarkdownConverter(
  document.querySelector(`.card textarea[name="post"]`),
  document.querySelector("#preview")
);

/**
 * @param {Element} domA
 * @param {Element} domB
 */
function previewSwitch(domA, domB) {
  domA.classList.add("hidden");
  domB.classList.remove("hidden");
}

const domForm = document.querySelector("#post-edit");
const domPreview = document.querySelector("#post-preview");

domForm.querySelectorAll(".preview-switch").forEach((element) =>
  element.addEventListener("click", () => {
    converter.convert();
    previewSwitch(domForm, domPreview);
  })
);
domPreview.querySelector(".preview-switch").addEventListener("click", () => {
  previewSwitch(domPreview, domForm);
});

previewSwitch(domPreview, domForm);
