import { useState, useEffect } from "react";
import { loadData } from "./loadData";

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData(setPosts, setError);
  },[]);

  return (
    <>
      { posts.map(post =>
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
