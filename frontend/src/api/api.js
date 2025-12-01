const API_URL = "https://soil-farming-agent-ki9z.onrender.com/api";

// ── USERS ──
export const registerUser = async (email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── SOIL ──
export const fetchSoilDetails = async () => {
  const res = await fetch(`${API_URL}/soil`);
  return res.ok ? res.json() : [];
};

export const postSoil = async (soilData) => {
  try {
    const res = await fetch(`${API_URL}/soil`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(soilData),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Bulk delete soils (admin only)
export const deleteSoils = async (ids) => {
  try {
    const res = await fetch(`${API_URL}/soil`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-role": "admin" },
      body: JSON.stringify({ ids }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Update soil by id (admin only)
export const updateSoil = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/soil/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-role": "admin" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// ── DISTRIBUTORS ──
export const fetchDistributors = async () => {
  const res = await fetch(`${API_URL}/distributors`);
  return res.ok ? res.json() : [];
};

export const postDistributor = async (distributorData) => {
  const res = await fetch(`${API_URL}/distributors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(distributorData),
  });
  return res.json();
};

// Bulk delete distributors (admin only)
export const deleteDistributors = async (ids) => {
  try {
    const res = await fetch(`${API_URL}/distributors`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-role": "admin" },
      body: JSON.stringify({ ids }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Update distributor by id (admin only)
export const updateDistributor = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/distributors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-role": "admin" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};
