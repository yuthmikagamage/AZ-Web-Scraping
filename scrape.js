import jsdom from "jsdom";
import fs, { link } from "fs";

const textContext = await fetch("https://a-z-animals.com/animals/").then(
  (response) => response.text()
);
const htmlContent = new jsdom.JSDOM(textContext);
const htmlDocument = htmlContent.window.document;
const list = htmlDocument.querySelectorAll(".list-item.col-md-4.col-sm-6");

const finalOutput = [];

for (let i = 0; i < 4; i++) {
  const item = list[i];
  const aElement = item.querySelector("a");
  const itemUrl = aElement.href;
  const itemTextContent = await fetch(itemUrl).then((response) =>
    response.text()
  );
  const itemHtmlContent = new jsdom.JSDOM(itemTextContent);
  const itemHtmlDocument = itemHtmlContent.window.document;

  const detailsList = itemHtmlDocument.querySelectorAll(
    ".col-sm-3.text-md-right"
  );

  const detailsOutput = [];

  const imageTag = itemHtmlDocument.querySelector("link[rel='preload'][media]");
  const imageUrl = imageTag.href;
  const fileName = imageUrl.split("/").pop();

  const imageResponse = await fetch(imageUrl);
  const arrayBuffer = await imageResponse.arrayBuffer();
  fs.writeFileSync(`outputs/${fileName}`, Buffer.from(arrayBuffer));

  for (let i = 0; i < detailsList.length; i++) {
    const detailsAElement = detailsList[i].querySelector("a");
    const detailsTopic = detailsAElement.textContent;
    const detailsDescriptionItem = detailsList[i].nextElementSibling;
    const detailsDescription = detailsDescriptionItem.innerHTML;
    detailsOutput.push(`${detailsTopic} : ${detailsDescription}`);
  }
  finalOutput.push({
    Name: aElement.textContent,
    Link: aElement.href,
    Image: imageUrl,
    Details: detailsOutput,
  });
}
fs.writeFileSync("outputs/animals.json", JSON.stringify(finalOutput, null, 2));
