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

export const loadData = (setPosts, setError) => {
  return pageSizes().reduce((currentPosts, pageSize, page) => {
    const posts = getPosts(page, pageSize);

    return currentPosts.then((previousPosts) => posts()
      .then((newPosts) => [...previousPosts, ...newPosts]));
  }, Promise.resolve([]))
  .then((posts) => {
    setPosts(posts);
    loadComments(posts).then(() => setPosts([...posts]));
  }).catch(setError);
};

const loadComments = (posts) => {
  return posts.forEach(post => {
    return axios.get(`${API_URL}/${post.id}/comments`)
    .then((response) => {
      post.comments = response.data;
    })
    .catch((error) => console.log(error));
  });
};
