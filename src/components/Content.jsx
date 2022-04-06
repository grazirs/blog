import { useState, useEffect } from "react";

const TOTAL_OF_PAGES = 4;
const POSTS_PER_PAGE = 20;
const NUMBER_OF_POSTS = 95;

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const loadData = () => {
    const startIndex = posts.length;
    const endIndex = startIndex + (posts.length < 80 ? POSTS_PER_PAGE : 15);
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${startIndex}&_end=${endIndex}`)
      .then((response) => {
        response.json().then((data) => {
          const updatedPosts = posts.concat(data);
          setPosts(updatedPosts);
        })
      })
      .catch((e) => {
        setError(e)
      });
  }

  useEffect(() => {
    if(posts.length < NUMBER_OF_POSTS){
      loadData();
    }
  });

  return (
    <>
      { posts.length === NUMBER_OF_POSTS && posts.map(post =>
        <div key={post.id}>
          <div>{post.id} {post.title}</div>
          <p>{post.body}</p>
        </div>
      )}
      { error != null && <span>Error</span> }
    </>
  )
}

export default Content;
