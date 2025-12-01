import React, { useEffect, useState } from "react";
import {
  fetchDistributors,
  updateDistributor,
  deleteDistributors,
} from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./ViewDistributor.css";

const ViewDistributor = () => {
  const { user, isAdmin } = useAuth(); // get admin info
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedIds, setSelectedIds] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchDistributors().then(setDistributors);
  }, []);

  const refresh = () => fetchDistributors().then(setDistributors);

  const startEdit = (dist) => {
    if (!isAdmin) return;
    setEditData({ ...dist });
  };

  const submitEdit = async () => {
    if (!editData) return;

    const { _id, ...payload } = editData;

    const res = await updateDistributor(_id, payload);
    if (res.success) {
      refresh();
      setEditData(null);
    }
  };

  const toggleSelect = (id) => {
    if (!isAdmin) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (!isAdmin || selectedIds.length === 0) return;

    const res = await deleteDistributors(selectedIds);
    if (res.success) {
      refresh();
      setSelectedIds([]);
    }
  };

  const filtered = distributors.filter((d) => {
    const s = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(s) ||
      d.contact.toLowerCase().includes(s) ||
      d.seedType.toLowerCase().includes(s)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let x = a[sortField];
    let y = b[sortField];

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return sortOrder === "asc" ? -1 : 1;
    if (x > y) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="view-distributor">
      <h2>Distributor Details</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {isAdmin && selectedIds.length > 0 && (
          <button className="delete-btn" onClick={deleteSelected}>
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            {isAdmin && <th>Select</th>}
            <th>Name</th>
            <th>Contact</th>
            <th>Seed Type</th>
            <th>Price</th>
            <th>Quantity</th>
            {isAdmin && <th>Edit</th>}
          </tr>
        </thead>

        <tbody>
          {sorted.map((d) => (
            <tr key={d._id}>
              {isAdmin && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(d._id)}
                    onChange={() => toggleSelect(d._id)}
                  />
                </td>
              )}
              <td>{d.name}</td>
              <td>{d.contact}</td>
              <td>{d.seedType}</td>
              <td>{d.price}</td>
              <td>{d.quantity}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => startEdit(d)}>Edit</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editData && isAdmin && (
        <div className="modal">
          <div className="modal-box">
            <h3>Edit Distributor</h3>

            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />
            <input
              value={editData.contact}
              onChange={(e) =>
                setEditData({ ...editData, contact: e.target.value })
              }
            />
            <input
              value={editData.seedType}
              onChange={(e) =>
                setEditData({ ...editData, seedType: e.target.value })
              }
            />
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: Number(e.target.value) })
              }
            />
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) =>
                setEditData({ ...editData, quantity: Number(e.target.value) })
              }
            />

            <div className="modal-actions">
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => setEditData(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDistributor;
