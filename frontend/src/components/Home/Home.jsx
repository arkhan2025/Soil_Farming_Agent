import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const API_BASE = "https://soil-farming-agent-ki9z.onrender.com/";

const Home = () => {
  const { user, isAdmin } = useAuth();

  /** WELCOME POPUP */
  const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    if (!user) return;
    const alreadyShown = localStorage.getItem("welcomeShown");
    if (!alreadyShown) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        localStorage.setItem("welcomeShown", "true");
      }, 3000);
    }
  }, [user]);

  /** STICKY TOP BAR */
  const [showStickyBar, setShowStickyBar] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** BLOG SYSTEM */
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [popupMsg, setPopupMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, blogId: null });

  const showPopup = (text) => {
    setPopupMsg(text);
    setTimeout(() => setPopupMsg(""), 2000);
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, sortOrder]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append("q", search);
      if (sortOrder) q.append("sort", sortOrder);

      const res = await fetch(`${API_BASE}/blogs?${q.toString()}`);
      const data = await res.json();
      setBlogs(data || []); // FIXED: use data directly, not data.blogs
    } catch (err) {
      showPopup("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    const allowed = list.filter((f) => /image\/(jpeg|jpg|png)/.test(f.type));
    setImages(allowed);
  };

  /** OPEN CREATE / EDIT MODAL */
  const openPostModal = (post = null) => {
    if (!user) return showPopup("Please login to post");
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDescription(post.description);
      setImages([]); // keep empty, old images shown separately
    } else {
      setEditingPost(null);
      setTitle("");
      setDescription("");
      setImages([]);
    }
    setShowModal(true);
  };

  /** CREATE / UPDATE POST */
  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showPopup("Title is required");

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("authorEmail", user.email || "unknown");

      if (images.length > 0) {
        images.forEach((f) => form.append("images", f));
      }

      let url = `${API_BASE}/blogs`;
      let method = "POST";

      if (editingPost) {
        url = `${API_BASE}/blogs/${editingPost._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "x-role": isAdmin ? "admin" : "user" },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        showPopup(editingPost ? "Blog updated!" : "Blog posted!");
        setTitle("");
        setDescription("");
        setImages([]);
        setShowModal(false);
        setEditingPost(null);
        fetchBlogs();
      } else {
        showPopup(data.message || (editingPost ? "Update failed" : "Post failed"));
      }
    } catch {
      showPopup("Server error");
    }
  };

  /** DELETE HANDLERS */
  const confirmDelete = (id) => setDeleteConfirm({ show: true, blogId: id });
  const cancelDelete = () => setDeleteConfirm({ show: false, blogId: null });

  const handleDelete = async (id) => {
    if (!isAdmin && blogs.find((b) => b._id === id)?.authorEmail !== user.email)
      return showPopup("Cannot delete this post");

    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-role": "admin" },
      });
      const data = await res.json();
      if (res.ok) {
        showPopup("Blog deleted");
        fetchBlogs();
      } else {
        showPopup(data.message || "Delete failed");
      }
    } catch {
      showPopup("Server error");
    } finally {
      cancelDelete();
    }
  };

  /** RENDER */
  return (
    <div className="home-container">
      {showStickyBar && (
        <div className="blog-sticky-bar">
          <button className="post-btn" onClick={() => openPostModal()}>+ Create Post</button>
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      )}

      {showWelcome && (
        <div className="welcome-popup">
          <div className="welcome-inner">
            <h1>Welcome to the Soil Farming Information Portal</h1>
            <p>Discover which crops thrive best in different soil types.</p>
          </div>
        </div>
      )}

      {popupMsg && <div className="popup-message">{popupMsg}</div>}

      <div className="post-controls">
        <button className="post-btn" onClick={() => openPostModal()}>+ Create Post</button>
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPost ? "Edit Blog Post" : "Create Blog Post"}</h3>
            <form onSubmit={handlePost}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Write your post..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleFiles}
              />
              {editingPost?.images?.length > 0 && images.length === 0 && (
                <div>
                  <p>Current images:</p>
                  <ul>
                    {editingPost.images.map((img, i) => (
                      <li key={i}>{img.split("/").pop()}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingPost ? "Update" : "Post"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Are you sure you want to delete this blog?</p>
            <div className="delete-actions">
              <button onClick={() => handleDelete(deleteConfirm.blogId)}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

      <div className="blogs-list">
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs yet.</p>
        ) : (
          blogs.map((b) => (
            <div className="blog-card" key={b._id}>
              <div className="blog-header">
                <h4>{b.title}</h4>
                <div className="blog-meta">
                  {isAdmin && <span>{b.authorEmail}</span>}
                  <span>{new Date(b.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <p className="blog-desc">{b.description}</p>

              {b.images?.length > 0 && (
                <div className="blog-images">
                  {b.images.map((img, i) => (
                    <img key={i} src={`${API_BASE.replace("/api", "")}${img}`} alt="" />
                  ))}
                </div>
              )}

              {(isAdmin || b.authorEmail === user?.email) && (
                <div className="post-actions">
                  {(isAdmin || b.authorEmail === user?.email) && (
                    <button className="delete-btn" onClick={() => confirmDelete(b._id)}>
                      Delete
                    </button>
                  )}
                  {b.authorEmail === user?.email && (
                    <button className="edit-btn" onClick={() => openPostModal(b)}>
                      Modify
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
