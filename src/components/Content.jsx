import { useState, useEffect } from "react";
import { loadData, loadComments, loadUsers } from "./loadData";

const Content = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const addComments = (loadedPosts) => {
    loadComments(loadedPosts).then((postsWithComments) => {
      setPosts(postsWithComments)
    }).catch(setError);
  };

  const addUsers = (loadedPosts) => {
    loadUsers(loadedPosts).then(setUsers).catch(setError);
  }

  useEffect(() => {
    loadData().then((loadedPosts) => {
      setPosts(loadedPosts);
      addComments(loadedPosts);
      addUsers(loadedPosts);
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
