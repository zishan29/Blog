"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "../../nav";
import styles from "./post.module.css";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        const res = await fetch(
          `https://zishan-blog-api.adaptable.app/posts/${id}`,
          {
            signal,
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [id]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        const res = await fetch(
          `https://zishan-blog-api.adaptable.app/posts/${id}/comments`,
          {
            signal,
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setComments(data.comments);
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [id]);

  async function addComment() {
    let data = {
      username: name,
      email: email,
      comment: message,
      postId: id,
    };
    try {
      const res = await fetch(
        `https://zishan-blog-api.adaptable.app/posts/${id}/comments`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const responseData = await res.json();

      const commentsRes = await fetch(
        `https://zishan-blog-api.adaptable.app/posts/${id}/comments`
      );
      if (!commentsRes.ok) {
        throw new Error(`HTTP error! Status: ${commentsRes.status}`);
      }
      const updatedComments = await commentsRes.json();
      setComments(updatedComments.comments);

      setName("");
      setEmail("");
      setMessage("");

      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long", // Long month name (e.g., January)
      day: "numeric", // Numeric day (e.g., 30)
      year: "numeric", // Full year (e.g., 2021)
    });
  };

  return (
    <div className={styles.main}>
      <Nav styles={styles} />
      <div className={styles.blogDetail}>Blog Details</div>
      {post === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={styles.post}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postContent}>{post.content}</p>
          </div>
          <div style={{ width: "40vw" }}>
            {comments && (
              <div
                style={{
                  fontSize: "32px",
                  justifySelf: "flex-start",
                  margin: "40px 0",
                  marginTop: "80px",
                  color: "#323232",
                }}
              >
                {comments.length} Comments
              </div>
            )}
            <div className={styles.comments}>
              {comments &&
                comments
                  .slice()
                  .reverse()
                  .map((comment, index) => (
                    <div key={index} className={styles.comment}>
                      <div className={styles.user}>{comment.username}</div>
                      <p className={styles.timestamp}>
                        {formatDate(comment.timeStamp)}
                      </p>
                      <p>{comment.comment}</p>
                    </div>
                  ))}
            </div>
          </div>
          <div style={{ width: "40vw", marginTop: "100px" }}>
            <div
              style={{
                justifySelf: "flex-start",
                fontSize: "32px",
                color: "#323232",
              }}
            >
              Leave a comment
            </div>
            <form action="" className={styles.form}>
              <label htmlFor="name">NAME *</label>
              <label htmlFor="email">EMAIL *</label>
              <input
                type="text"
                id="name"
                name="name"
                ref={nameRef}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <input
                type="email"
                id="email"
                email="email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label htmlFor="message" style={{ gridColumn: "1 / -1" }}>
                MESSAGE *
              </label>
              <textarea
                type="text"
                id="message"
                message="message"
                ref={messageRef}
                onChange={(e) => setMessage(e.target.value)}
                style={{ gridColumn: "1 / -1" }}
                rows="15"
              ></textarea>
              <button type="button" onClick={() => addComment()}>
                POST COMMENT
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
