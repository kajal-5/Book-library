const FIREBASE_API_KEY = "AIzaSyDv4-aofLFqOnDJI3aOJO57hkgtoMs1zvY";
const AUTH_BASE_URL = "https://identitytoolkit.googleapis.com/v1";
const DB_BASE_URL =
  "https://book-app-339c8-default-rtdb.firebaseio.com";

/* =========================
   HELPER → EMAIL TO FIREBASE KEY
========================= */
const emailToKey = (email) => email.replace(/\./g, "_");

/* =========================
   FIREBASE ERROR HANDLER
========================= */
const getFirebaseError = (code) => {
  switch (code) {
    case "EMAIL_EXISTS":
      return "Email already exists";
    case "INVALID_PASSWORD":
      return "Invalid password";
    case "EMAIL_NOT_FOUND":
      return "Email not registered";
    case "INVALID_EMAIL":
      return "Invalid email format";
    case "WEAK_PASSWORD":
      return "Password should be at least 6 characters";
    default:
      return "Something went wrong";
  }
};

/* =========================
   SIGN UP
========================= */
export const signupApi = async (email, password, name, contactNo, address) => {
  // Trim all fields
  const trimmedName = name.trim();
  const trimmedContactNo = contactNo.trim();
  const trimmedAddress = address.trim();

  // Validate contact number is exactly 10 digits
  if (!/^\d{10}$/.test(trimmedContactNo)) {
    throw new Error("Contact number must be exactly 10 digits");
  }

  const response = await fetch(
    `${AUTH_BASE_URL}/accounts:signUp?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getFirebaseError(data.error?.message));
  }

  // ✅ save user with trimmed name, contactNo, and address
  await saveUserRoleApi(email, "user", trimmedName, trimmedContactNo, trimmedAddress);

  return data;
};


/* =========================
   LOGIN
========================= */
export const loginApi = async (email, password) => {
  const response = await fetch(
    `${AUTH_BASE_URL}/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getFirebaseError(data.error?.message));
  }

  return data;
};

/* =========================
   SAVE USER (EMAIL BASED)
========================= */
export const saveUserRoleApi = async (email, role, name = "", contactNo = "", address = "") => {
  const emailKey = emailToKey(email);

  const response = await fetch(
    `${DB_BASE_URL}/users/${emailKey}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        role,
        name,
        contactNo,
        address,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save user");
  }

  // return true;
};

/* =========================
   GET USER ROLE (EMAIL BASED)
========================= */
export const getUserRoleApi = async (email) => {
  const emailKey = emailToKey(email);

  const response = await fetch(
    `${DB_BASE_URL}/users/${emailKey}.json`
  );

  const data = await response.json();

  if (!response.ok || !data) {
    throw new Error("User not found");
  }

  return data; // { email, role }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPasswordApi = async (email) => {
  const response = await fetch(
    `${AUTH_BASE_URL}/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestType: "PASSWORD_RESET",
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getFirebaseError(data.error?.message));
  }

  return data;
};


export const verifyTokenApi = async (idToken) => {
  const response = await fetch(
    `${AUTH_BASE_URL}/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Session expired");
  }

  return data; // valid token → user info
};

/* =========================
   REFRESH TOKEN
========================= */
export const refreshTokenApi = async (refreshToken) => {
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
  };
};