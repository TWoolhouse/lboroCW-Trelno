import { navbar } from "../../nav.js";

navbar();

export function createConverter(headerLevelStart = 3) {
  const converter = new showdown.Converter({
    noHeaderId: true,
    headerLevelStart: headerLevelStart,
  });

  return {
    /**
     * @param {String} markdown
     * @returns {Element}
     */
    convert: (markdown) => converter.makeHtml(markdown),
    converter: converter,
    /**
     * @param {Element} domIn
     * @param {Element} domOut
     */
    transferDOM: (domIn, domOut) => {
      return () => {
        const md = domIn.value ? domIn.value : domIn.placeholder;
        const html = converter.makeHtml(md);
        domOut.innerHTML = html;
      };
    },
  };
}
