console.log(showdown);

const DomIn = document.querySelector(".card.post textarea");
const DomOut = document.querySelector("#test");

const converter = new showdown.Converter({ noHeaderId: true });

function convert() {
  const md = DomIn.value;
  const html = converter.makeHtml(md);
  DomOut.innerHTML = html;
}

DomIn.addEventListener("input", convert);

// document.querySelector(".card.submit form").onsubmit = (event) => {
//   event.preventDefault();
//   convert();
// };
