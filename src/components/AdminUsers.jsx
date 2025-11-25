// src/components/AdminUsers.jsx
import { useEffect, useState } from "react";
// import { getAllUsers, updateUserProfile, deleteUserProfile } from "../services/userService";
import { getAllUsers, updateUser, deleteUser } from "../services/userService";
import Loading from "./Loading";

import "../styles/components/AdminUsers.scss";



function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const usersList = await getAllUsers();
    setUsers(usersList);
    setLoading(false);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUserData(user);
  };

  const handleSaveClick = async () => {
    try {
      //await updateUserProfile(editingUserId, editedUserData);
      await updateUser(editingUserId, editedUserData);
      setEditingUserId(null);
      loadUsers();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      //await deleteUserProfile(userId);
      await deleteUser(userId);
      loadUsers();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <Loading text="Cargando usuarios..." />;

  //filtrado de usuarios por nombre
  const usersFiltered = users.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()  )
  );

  return (
    <div className="admin-users-wrapper">
      <h2>Usuarios</h2>

     {/* 🔎 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellidos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />
    <div className="admin-bookings">
      {usersFiltered.map((user) => (
        <div className="user-card" key={user.id}>
          {editingUserId === user.id ? (
             <div className="user-box">
              <div className="user-info">
              <input type="text" name="nombre" value={editedUserData.nombre} onChange={handleInputChange} />
              <input type="text" name="apellidos" value={editedUserData.apellidos} onChange={handleInputChange} />
              <input type="text" name="direccion" value={editedUserData.direccion} onChange={handleInputChange} />
              <input type="text" name="portal" value={editedUserData.portal} onChange={handleInputChange} />
              <input type="text" name="piso" value={editedUserData.piso} onChange={handleInputChange} />
              <input type="text" name="telefono" value={editedUserData.telefono} onChange={handleInputChange} />
              <input type="text" name="email" value={editedUserData.email} onChange={handleInputChange} />
            </div>
              <div className="actions">
                <button className="save" onClick={handleSaveClick}>Guardar</button>
                <button className="cancel" onClick={() => setEditingUserId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="user-box">
              <div className="user-info">
                <div className="user-name">
                  <span><strong>Nombre:</strong> {user.nombre}</span>
                  <span>{user.apellidos}</span>
                </div>
                <div className="user-direction">
                  <span><strong>Dirección:</strong> {user.direccion}</span>
                  <span><strong>nº:</strong> {user.portal}</span>
                  <span><strong>Piso:</strong> {user.piso}</span>
                </div>
                <div className="user-contact">
                  <span><strong>Teléfono:</strong> {user.telefono}</span>
                  <span><strong>Email:</strong> {user.email}</span>
                </div>
              </div>
              <div className="actions">
                  <button className="edit" onClick={() => handleEditClick(user)}>Editar</button>
                  <button className="delete" onClick={() => handleDeleteClick(user.id)}>
                    Eliminar
                  </button>
              </div>
              
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default AdminUsers;

