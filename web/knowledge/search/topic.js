import * as api from "../../api/core.js";
import { HTMLasDOM } from "/nav.js";

export async function topics() {
  const topics = await api.topics();
  const select = document.querySelector(".search .dropdown-topic");
  select.innerHTML = createTopicOptionHTML({ id: "", name: "Any Topic" });
  for (const topic of topics)
    select.appendChild(HTMLasDOM(createTopicOptionHTML(topic)));
  return select;
}

/**
 * @param {Topic} topic
 * @returns {String} HTML
 */
function createTopicOptionHTML(topic) {
  return /* HTML */ `<option value="${topic.id}">${topic.name}</option>`;
}
