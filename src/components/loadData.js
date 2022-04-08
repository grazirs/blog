const axios = require('axios');

const PAGE_SIZE = 20;
const NUMBER_OF_POSTS = 95;
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const pageSizes = () => {
  const fullPages = Math.floor(NUMBER_OF_POSTS / PAGE_SIZE);
  const lastPageSize = NUMBER_OF_POSTS % PAGE_SIZE;
  const pages = [...new Array(fullPages).fill(PAGE_SIZE)];
  if(lastPageSize !== 0){
    pages.push(lastPageSize);
  }
  return pages;
};

const getPosts = (page, pageSize) => () => {
  return axios.get(API_URL, {
    params: {
      _start: page * PAGE_SIZE,
      _limit: pageSize
    }
  })
  .then((response) => response.data);
};

export const loadData = () => {
  return pageSizes().reduce((currentPosts, pageSize, page) => {
    const posts = getPosts(page, pageSize);

    return currentPosts.then((previousPosts) => posts()
      .then((newPosts) => [...previousPosts, ...newPosts]));
  }, Promise.resolve([]));
};

export const loadComments = (posts) => {
  return Promise.all(posts.map(post => {
    return axios.get(`${API_URL}/${post.id}/comments`)
    .then((response) => {
      return {...post, comments: response.data};
    })
    .catch((error) => console.log(error));
  }));
};
