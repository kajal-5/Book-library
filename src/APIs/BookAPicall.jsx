const DB_BASE_URL =
  "https://book-app-339c8-default-rtdb.firebaseio.com";

/* =========================
   BOOK KEY
========================= */
const bookNameToKey = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, "-");

/* =========================
   ADD BOOK (ADMIN)
========================= */
export const addBookApi = async (bookData) => {
  const { name, description, type, price, quantity, imageUrl, mobileNo, contactName } = bookData;
  if (!imageUrl) {
    throw new Error("Image URL is required");
  }
  const trimmedName = name.trim();
  const bookKey = bookNameToKey(trimmedName);
  const saveBook = {
    name: trimmedName,
    description: description || "",
    type: type || "",
    price,
    quantity,
    imageUrl,
    mobileNo: mobileNo || "",
    contactName: contactName || "",
    createdAt: new Date().toISOString(),
  };
  const response = await fetch(
    `${DB_BASE_URL}/books/${bookKey}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveBook),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  return { id: bookKey, ...saveBook };
};

/* =========================
   GET ALL BOOKS (USER + ADMIN)
========================= */
export const getAllBooksApi = async () => {
  const response = await fetch(`${DB_BASE_URL}/books.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  if (!data) return [];

  //  convert object → array
  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

/* =========================
   DELETE BOOK (ADMIN)
========================= */
export const deleteBookApi = async (bookId) => {
  const response = await fetch(
    `${DB_BASE_URL}/books/${bookId}.json`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }

  return bookId;
};

/* =========================
   UPDATE BOOK (ADMIN)
========================= */
export const updateBookApi = async (bookId, bookData) => {
  const response = await fetch(
    `${DB_BASE_URL}/books/${bookId}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bookData,
        updatedAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return { id: bookId, ...bookData };
};

/* =========================
   RENT BOOK (USER)
========================= */
export const rentBookApi = async (rentalData) => {
  const response = await fetch(
    `${DB_BASE_URL}/rentBook.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rentalData,
        timestamp: Date.now(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save rental");
  }

  const data = await response.json();
  return { id: data.name, ...rentalData };
};
