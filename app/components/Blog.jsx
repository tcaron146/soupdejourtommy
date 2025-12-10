// components/Blog.js
'use client'
import { useState, useEffect } from 'react';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Fetch existing posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Function to add a new post
  const addPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
      });
      const addedPost = await response.json();
      setPosts((prevPosts) => [...prevPosts, addedPost]); // Update posts list
      setNewPostTitle(''); // Clear form
      setNewPostContent('');
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={addPost}>
        <h2>Add a New Post</h2>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Post Title"
          required
        />
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Post Content"
          required
        />
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}
