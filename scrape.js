import jsdom from "jsdom";

const textContext = await fetch("https://a-z-animals.com/animals/").then(
  (response) => response.text()
);
const htmlContent = new jsdom.JSDOM(textContext);
const htmlDocument = htmlContent.window.document;
const item = htmlDocument.querySelector(".list-item.col-md-4.col-sm-6");
const itemA = item.querySelector("a");
console.log(itemA.textContent);
