import * as cereal from "../interface/cereal.js";
import { Collection } from "../interface/collection.js";
import * as db from "../interface/db.js";
import { Memoize } from "../interface/memoize.js";

/** @typedef {import("./user").User} User */

export class Topic {
  /** @property {Number} id The TopicID */
  id;
  /** @property {String} name The name of the topic */
  name;

  /**
   * @param {Number} id The TopicID
   * @param {String} name The name of the topic
   */
  constructor(id, name) {
    if (!cereal.cereal(this, id)) {
      this.id = id;
      this.name = name;
    }
    this._posts = new Collection();
  }

  /**
   * @returns {Collection<Post>} A collection of posts that are a part of this topic
   */
  posts() {
    db.topicPosts(this.id).then((values) => {
      this._posts.add(...values);
    });
    return this._posts;
  }
}
cereal.register(Topic);
new Memoize(Topic);

export class Post {
  /** @property {Number} id The PostID */
  id;
  /** @property {Topic} topic The Topic this post is part of */
  topic;
  /** @property {User} owner The User that created this post */
  owner;
  /** @property {String} title The title of the post */
  title;
  /** @property {String} markdown The markdown contents of the post */
  markdown;
  /** @property {Number} created The timestamp of the posts creation */
  created;

  /**
   * @param {Number} id The PostID
   * @param {Topic} topic The Topic this post is part of
   * @param {User} owner The User that created this post
   * @param {String} title The title of the post
   * @param {String} markdown The markdown contents of the post
   * @param {Number} created The timestamp of the posts creation
   */
  constructor(id, topic, owner, title, markdown, created) {
    if (cereal.cereal(this, id)) return this;
    this.id = id;
    this.topic = topic;
    this.owner = owner;
    this.title = title;
    this.markdown = markdown;
    this.created = created;
  }
}
cereal.register(Post);
new Memoize(Post);

/**
 * @param {Post} post
 * @param {Array<String>} queries
 * @returns {Boolean}
 */
function matchSearch(post, queries) {
  const title = post.title.toLowerCase();
  for (const query of queries) if (title.includes(query)) return true;
  return false;
}

/**
 * @param {String} query The search query
 * @param {String} [topicId] The topicID that the search is restricted to
 * @returns {Promise<Array<Post>>} Every post in the system
 */
export async function search(query, topicId) {
  const queries = query ?? "".toLowerCase().split();
  const posts = await (topicId ? db.topicPosts(topicId) : db.posts());
  if (!query) return posts;
  return posts.filter((post) => matchSearch(post, queries));
}

/**
 * @returns {Promise<Array<Topic>>} Every topic in the system
 */
export async function topics() {
  return await db.topics();
}
