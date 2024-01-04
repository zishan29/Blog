"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "./nav";

export default function Home() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    (async () => {
      try {
        const res = await fetch(`https://zishan-blog-api.adaptable.app/posts`, {
          signal,
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short", // Short month name (e.g., Jan)
      day: "numeric", // Numeric day (e.g., 30)
      year: "numeric", // Full year (e.g., 2021)
    });
  };

  return (
    <main className={styles.main}>
      <Nav styles={styles} />
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div className={styles.subHeading1}>
            A PERSONAL{" "}
            <span
              style={{ borderBottom: "1px solid black", paddingBottom: "4px" }}
            >
              BLOG
            </span>
          </div>
          <div className={styles.heading}>
            Selfscape{" "}
            <span style={{ color: "#444444", WebkitTextFillColor: "#444444" }}>
              Stories.
            </span>
          </div>
          <div className={styles.subHeading2}>
            I am a Blogger & Software Developer based in Philippines
          </div>
        </div>
      </div>
      <div>
        {posts === null ? (
          <p>Loading...</p>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          <div className={styles.cards}>
            <div
              style={{
                gridColumn: "1 / -1",
                fontSize: "32px",
                color: "#444444",
              }}
            >
              {posts.length} Posts
            </div>
            {posts.map((post, index) => (
              <Link
                key={post._id}
                href={`/posts/${post._id}`}
                className={`${styles.links} ${styles.card}`}
              >
                <div className={styles.cardHeader}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg
                      fill="#444444"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>account</title>
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                    {post.user.username}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg
                      fill="##444444"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>calendar-month</title>
                      <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" />
                    </svg>
                    {formatDate(post.timeStamp)}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg
                      fill="##444444"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>comment</title>
                      <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
                    </svg>
                    {post.comments.length} comments
                  </span>
                </div>
                <h3
                  style={{
                    color: "#444444",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textWrap: "nowrap",
                  }}
                >
                  {post.title}
                </h3>
                <p className={styles["truncate-text"]}>{post.content}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </main>
  );
}
