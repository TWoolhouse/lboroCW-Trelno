import { currentUser } from "../../../api/active.js";
import * as api from "../../../api/core.js";
import { HTMLasDOM } from "../../../nav.js";
import * as md from "../editor.js";

const converter = md.createConverter();
const updatePreview = converter.transferDOM(
  document.querySelector(`textarea[name="post"]`),
  document.querySelector("#preview")
);

const domForm = document.querySelector("#post-edit");
const domPreview = document.querySelector("#post-preview");

const switches = [md.switcher(domForm, domPreview)];

for (const switcher of switches) switcher.backward();

domForm.querySelectorAll(".preview-switch").forEach((element) =>
  element.addEventListener("click", () => {
    updatePreview();
    for (const switcher of switches) switcher.forward();
  })
);
domPreview.querySelector(".preview-switch").addEventListener("click", () => {
  for (const switcher of switches) switcher.backward();
});

api.topics().then((topics) => {
  const dropdown = domForm.querySelector('[name="topic"]');
  dropdown.innerHTML = createDropdownTopicHTML({
    id: "",
    name: "Pick a Topic this Post relates to...",
  });
  dropdown.appendChild(
    HTMLasDOM(createDropdownTopicHTML({ id: "new", name: "Create New Topic" }))
  );
  for (const topic of topics.sort((a, b) => a.name.localeCompare(b.name)))
    dropdown.appendChild(HTMLasDOM(createDropdownTopicHTML(topic)));
});

const form = document.querySelector("form.post-edit");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const topicSelector = form.querySelector('[name="topic"]');
  let topicId = topicSelector.value;
  if (topicId == "new") {
    const popup = document.querySelector("#dialog-new-topic");
    const name = await new Promise((resolve) => {
      popup.showModal();
      popup.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        popup.close();
        resolve(popup.querySelector("input").value);
        return false;
      });
      popup.querySelector(".dialog-close").addEventListener("click", () => {
        popup.close();
        // Have discovered a couple of bugs, For example when you type a topic in then close it, and then click share post, it creates two versions of the topic for somes reason
        //I have no idea how to stop or fix this however, probably not worth fixing for the prototype for now
      });
    });
    const topic = await api.createTopic(name);
    topicId = topic.id;
    topicSelector.appendChild(HTMLasDOM(createDropdownTopicHTML(topic)));
    topicSelector.value = topicId;
  }

  const topic = await api.topic(topicId);
  if (!topic) {
    event.preventDefault();
    return false;
  }

  const post = await api.createPost(
    topic,
    currentUser,
    form.querySelector('[name="title"]').value,
    form.querySelector('[name="post"]').value
  );

  // form.action = `../?id=${post.id}`;
  window.location.href = `../?id=${post.id}`;
});

/**
 * @param {Topic} topic
 * @returns {String}
 */
function createDropdownTopicHTML(topic) {
  return /* HTML */ `<option value="${topic.id}">${topic.name}</option>`;
}
