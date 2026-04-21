import React, { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [hoveredEdit, setHoveredEdit] = useState(null);
  const [hoveredDelete, setHoveredDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  // Fetch books
  const getBooks = async () => {
    const res = await fetch("http://localhost:8080/books");
    const data = await res.json();
    setBooks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    getBooks();
  }, []);

  // Add or Update book
  const addBook = async () => {
    if (!title || !author || !price) {
      alert("Please fill all fields");
      return;
    }

    if (isNaN(price)) {
      alert("Price must be a number");
      return;
    }

    if (editingId) {
      await fetch(`http://localhost:8080/books/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, price }),
      });

      setEditingId(null);
    } else {
      await fetch("http://localhost:8080/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, price }),
      });
    }

    setTitle("");
    setAuthor("");
    setPrice("");

    getBooks();
  };

  // Delete book
  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:8080/books/${id}`, {
      method: "DELETE",
    });

    getBooks();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>📚 Bookstore</h2>

      <div style={{ marginBottom: "20px" }}>
        {/* SEARCH */}
        <input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={async () => {
            const res = await fetch(
              `http://localhost:8080/books/search?title=${search}`
            );
            const data = await res.json();
            setBooks(Array.isArray(data) ? data : []);
          }}
        >
          Search
        </button>

        {/* SORT */}
        <button
          onClick={async () => {
            const res = await fetch("http://localhost:8080/books/sort");
            const data = await res.json();
            setBooks(Array.isArray(data) ? data : []);
          }}
        >
          Sort by Price
        </button>

        {/* FILTER */}
        <input
          placeholder="Filter price less than"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
        />

        <button
          onClick={async () => {
            if (!filterPrice) {
              alert("Please enter price to filter");
              return;
            }

            const res = await fetch(
              `http://localhost:8080/books/filter?price=${filterPrice}`
            );
            const data = await res.json();
            setBooks(Array.isArray(data) ? data : []);
          }}
        >
          Filter
        </button>

        {/* RESET */}
        <button onClick={getBooks}>Reset</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input value={author} placeholder="Author" onChange={(e) => setAuthor(e.target.value)} />
        <input value={price} placeholder="Price" onChange={(e) => setPrice(e.target.value)} />

        <button
          style={{
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={addBook}
        >
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {books.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>No books available</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {(Array.isArray(books) ? books : []).map((book) => (
              <div
                key={book.id}
                style={{
                  background: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{book.title}</div>
                <div>{book.author}</div>
                <div>₹{book.price}</div>

                <div style={{ marginTop: "10px" }}>
                  <button
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      backgroundColor:
                        hoveredEdit === book.id ? "#0056b3" : "#007bff",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredEdit(book.id)}
                    onMouseLeave={() => setHoveredEdit(null)}
                    onClick={() => {
                      setTitle(book.title);
                      setAuthor(book.author);
                      setPrice(book.price);
                      setEditingId(book.id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      backgroundColor:
                        hoveredDelete === book.id ? "#c82333" : "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredDelete(book.id)}
                    onMouseLeave={() => setHoveredDelete(null)}
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;