// src/pages/AdminPage.jsx

import AdminUsers from "../components/AdminUsers";
import AdminBookings from "../components/AdminBookings";
import Header from "../components/Header";
import BillingSummary from "../components/BillingSummary";

import "../styles/pages/AdminPage.scss";


function AdminPage() {

  return (
    <div className="admin-page">
      <header>         
        <Header/>
      </header>
      <div className="admin-title">
        <h1>Panel de Administración</h1>
      </div>
      
      <div className="admin-container">
        <AdminBookings />
        <AdminUsers />
      </div>
      <BillingSummary mode="admin" />
    </div>
  )
}

export default AdminPage;
