import { useState, useEffect } from "react";
import { loadData, loadComments } from "./loadData";

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const addComments = (loadedPosts) => {
    loadComments(loadedPosts).then((postsWithComments) => {
      setPosts(postsWithComments)
    }).catch(setError);
  };

  useEffect(() => {
    loadData().then((loadedPosts) => {
      setPosts(loadedPosts);
      addComments(loadedPosts);
    }).catch(setError);
  },[]);

  return (
    <>
      { posts.map(post =>
        <div key={post.id}>
          <div>{post.id} {post.title}</div>
          <p>{post.body}</p>
          <p>number of comments: {post.comments?.length}</p>
        </div>
      )}
      { error != null && <span>Error</span> }
    </>
  )
}

export default Content;
