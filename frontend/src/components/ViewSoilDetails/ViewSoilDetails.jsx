import React, { useEffect, useState } from "react";
import { fetchSoilDetails, deleteSoils, updateSoil } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./ViewSoilDetails.css";

const ViewSoilDetails = () => {
  const { user, isAdmin } = useAuth();
  const [soils, setSoils] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedIds, setSelectedIds] = useState([]);
  const [editingSoil, setEditingSoil] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    suitableCrops: "",
    phLevel: "",
    nutrients: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const showPopup = (msg) => {
    setPopupMsg(msg);
    setTimeout(() => setPopupMsg(""), 2000);
  };

  const loadSoils = async () => {
    setLoading(true);
    try {
      const data = await fetchSoilDetails();
      setSoils(data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to fetch soils");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoils();
  }, []);

  const filteredSoils = soils.filter((soil) => {
    const s = search.toLowerCase();
    return (
      soil.name.toLowerCase().includes(s) ||
      soil.description?.toLowerCase().includes(s) ||
      soil.suitableCrops?.some((c) => c.toLowerCase().includes(s)) ||
      soil.nutrients?.some((n) => n.toLowerCase().includes(s)) ||
      soil.phLevel?.toString().includes(s)
    );
  });

  const sortedSoils = [...filteredSoils].sort((a, b) => {
    if (!sortField) return 0;

    let x = a[sortField];
    let y = b[sortField];

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return sortOrder === "asc" ? -1 : 1;
    if (x > y) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  /** -------- Bulk Delete (Distributor-like behavior) -------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedIds.length} selected soil record(s)?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await deleteSoils(selectedIds);

      setSoils((prev) => prev.filter((soil) => !selectedIds.includes(soil._id)));
      setSelectedIds([]);
      showPopup("Selected soils deleted");
    } catch (err) {
      console.error(err);
      showPopup("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- Modify Soil ---------------- */
  const openEditModal = (soil) => {
    setEditingSoil(soil);
    setEditValues({
      name: soil.name,
      description: soil.description || "",
      suitableCrops: soil.suitableCrops?.join(", ") || "",
      phLevel: soil.phLevel || "",
      nutrients: soil.nutrients?.join(", ") || "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = {
        ...editValues,
        suitableCrops: editValues.suitableCrops.split(",").map((x) => x.trim()),
        nutrients: editValues.nutrients.split(",").map((x) => x.trim()),
      };

      await updateSoil(editingSoil._id, updated);

      setSoils((prev) =>
        prev.map((soil) =>
          soil._id === editingSoil._id ? { ...soil, ...updated } : soil
        )
      );
      setShowEditModal(false);
      setEditingSoil(null);

      showPopup("Soil updated");
    } catch (err) {
      console.error(err);
      showPopup("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-soil">
      <h2>Soil Details</h2>

      {popupMsg && <div className="popup-message">{popupMsg}</div>}

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, crop, nutrient, pH..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="">Sort by</option>
          <option value="phLevel">pH Level</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {isAdmin && selectedIds.length > 0 && (
          <button className="bulk-delete-btn" onClick={handleBulkDelete}>
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading soils...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Select</th>}
              <th>Name</th>
              <th>Description</th>
              <th>Suitable Crops</th>
              <th>pH Level</th>
              <th>Nutrients</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {sortedSoils.map((soil) => (
              <tr key={soil._id}>
                {isAdmin && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(soil._id)}
                      onChange={() => toggleSelect(soil._id)}
                    />
                  </td>
                )}

                <td>{soil.name}</td>
                <td>{soil.description}</td>
                <td>{soil.suitableCrops?.join(", ")}</td>
                <td>{soil.phLevel}</td>
                <td>{soil.nutrients?.join(", ")}</td>

                {isAdmin && (
                  <td>
                    <button onClick={() => openEditModal(soil)}>Modify</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Soil</h3>

            <form onSubmit={handleEditSubmit}>
              <input
                name="name"
                value={editValues.name}
                onChange={handleEditChange}
                placeholder="Name"
                required
              />
              <textarea
                name="description"
                value={editValues.description}
                onChange={handleEditChange}
                placeholder="Description"
              />
              <input
                name="suitableCrops"
                value={editValues.suitableCrops}
                onChange={handleEditChange}
                placeholder="Suitable Crops (comma-separated)"
              />
              <input
                name="phLevel"
                value={editValues.phLevel}
                onChange={handleEditChange}
                placeholder="pH Level"
              />
              <input
                name="nutrients"
                value={editValues.nutrients}
                onChange={handleEditChange}
                placeholder="Nutrients (comma-separated)"
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSoilDetails;
