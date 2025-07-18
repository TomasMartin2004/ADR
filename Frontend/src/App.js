import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/empleados/";

function App() {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    salario: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}${editingId}/`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_BASE_URL, formData);
      }
      setFormData({ nombre: "", apellido: "", dni: "", salario: "" });
      setShowForm(false);
      fetchEmpleados();
    } catch (error) {
      console.error("Error saving empleado:", error);
    }
  };

  const handleEdit = (empleado) => {
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      dni: empleado.dni,
      salario: empleado.salario,
    });
    setEditingId(empleado.id);
    setShowForm(true);
  };

  const handleDeleteClick = (empleado) => {
    setDeleteId(empleado.id);
    setDeleteName(empleado.nombre_completo);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}${deleteId}/`);
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteName("");
      fetchEmpleados();
    } catch (error) {
      console.error("Error deleting empleado:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const handleCancel = () => {
    setFormData({ nombre: "", apellido: "", dni: "", salario: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido al Portal de Empleados</h1>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="header-actions">
            <h2>Lista de Empleados</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Añadir Nuevo Empleado
            </button>
          </div>

          {showForm && (
            <div className="form-container">
              <h3>{editingId ? "Editar Empleado" : "Nuevo Empleado"}</h3>
              <form onSubmit={handleSubmit} className="empleado-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>DNI:</label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salario:</label>
                  <input
                    type="number"
                    name="salario"
                    value={formData.salario}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    {editingId ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="empleados-list">
            {empleados.length === 0 ? (
              <p className="no-empleados">No hay empleados registrados</p>
            ) : (
              empleados.map((empleado) => (
                <div key={empleado.id} className="empleado-card">
                  <div className="empleado-info">
                    <h4>{empleado.nombre_completo}</h4>
                    <p>
                      <strong>DNI:</strong> {empleado.dni}
                    </p>
                    <p>
                      <strong>Salario:</strong> ${empleado.salario}
                    </p>
                  </div>
                  <div className="empleado-actions">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(empleado)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(empleado)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que quieres eliminar a{" "}
                <strong>{deleteName}</strong>?
              </p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
