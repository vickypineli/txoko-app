// src/components/AdminUsers.jsx
import { useEffect, useState } from "react";
import { getAllUsers, updateUserProfile, deleteUserProfile } from "../services/userService";
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
      await updateUserProfile(editingUserId, editedUserData);
      setEditingUserId(null);
      loadUsers();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
    }
  };

  const handleDeleteClick = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await deleteUserProfile(userId);
      loadUsers();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Cargando usuarios...</div>;

  //filtrado de usuarios por nombre
  const usersFiltered = users.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()  )
  );

  return (
    <div className="admin-users">
      <h2>Gestión de Usuarios</h2>

     {/* 🔎 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellidos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />
      
      {usersFiltered.map((user) => (
        <div className="user-card" key={user.id}>
          {editingUserId === user.id ? (
            <>
              <input type="text" name="nombre" value={editedUserData.nombre} onChange={handleInputChange} />
              <input type="text" name="apellidos" value={editedUserData.apellidos} onChange={handleInputChange} />
              <input type="text" name="direccion" value={editedUserData.direccion} onChange={handleInputChange} />
              <input type="text" name="portal" value={editedUserData.portal} onChange={handleInputChange} />
              <input type="text" name="piso" value={editedUserData.piso} onChange={handleInputChange} />
              <input type="text" name="telefono" value={editedUserData.telefono} onChange={handleInputChange} />
              <input type="text" name="email" value={editedUserData.email} onChange={handleInputChange} />

              <button onClick={handleSaveClick}>Guardar</button>
              <button onClick={() => setEditingUserId(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Apellidos:</strong> {user.apellidos}</p>
              <p><strong>Dirección:</strong> {user.direccion}</p>
              <p><strong>Portal:</strong> {user.portal}</p>
              <p><strong>Piso:</strong> {user.piso}</p>
              <p><strong>Teléfono:</strong> {user.telefono}</p>
              <p><strong>Email:</strong> {user.email}</p>

              <button onClick={() => handleEditClick(user)}>Editar</button>
              <button onClick={() => handleDeleteClick(user.id)}>Eliminar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminUsers;

