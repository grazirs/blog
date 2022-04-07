const axios = require("axios");

const PAGE_SIZE = 20;
const NUMBER_OF_POSTS = 95;
const API_URL = "https://jsonplaceholder.typicode.com";

const pageSizes = () => {
  const fullPages = Math.floor(NUMBER_OF_POSTS / PAGE_SIZE);
  const lastPageSize = NUMBER_OF_POSTS % PAGE_SIZE;
  const pages = [...new Array(fullPages).fill(PAGE_SIZE)];
  if (lastPageSize !== 0) {
    pages.push(lastPageSize);
  }
  return pages;
};

const getPosts = (page, pageSize) => () => {
  return axios
    .get(`${API_URL}/posts`, {
      params: {
        _start: page * PAGE_SIZE,
        _limit: pageSize,
      },
    })
    .then((response) => response.data);
};

export const loadData = () => {
  return pageSizes().reduce((currentPosts, pageSize, page) => {
    const posts = getPosts(page, pageSize);

    return currentPosts.then((previousPosts) =>
      posts().then((newPosts) => [...previousPosts, ...newPosts])
    );
  }, Promise.resolve([]));
};

export const loadComments = (posts) => {
  return posts.reduce((updatedPosts, currentPost) => {
    const post = axios
      .get(`${API_URL}/posts/${currentPost.id}/comments`)
      .then((response) => {
        return { ...currentPost, comments: response.data };
      });
    return updatedPosts.then((previousPosts) => {
      return post.then((updatedPost) => {
        return [...previousPosts, updatedPost];
      });
    });
  }, Promise.resolve([]));
};

export const loadUsers = (posts) => {
  return posts.reduce((users, currentPost, index) => {
    const existingPostForCurrentPost = posts.findIndex(
      (post) => post.userId === currentPost.userId
    );
    if (existingPostForCurrentPost < index) return users;
    const user = axios
      .get(`${API_URL}/users/${currentPost.userId}`)
      .then((response) => response.data);
    return users.then((previousUsers) =>
      user.then((newUser) => [...previousUsers, newUser])
    );
  }, Promise.resolve([]));
};
