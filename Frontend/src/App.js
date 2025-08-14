import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const API_BASE_URL = "http://172.191.206.116:8000/api/empleados/";

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

  const getTotalSalarios = () => {
    return empleados.reduce(
      (total, empleado) => total + parseFloat(empleado.salario),
      0
    );
  };

  const getPromedioSalarios = () => {
    if (empleados.length === 0) return 0;
    return getTotalSalarios() / empleados.length;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-icon">👥</div>
          <h1>Sistema de Gestión de Empleados</h1>
          <p className="header-subtitle">
            Administra tu equipo de trabajo de manera eficiente y profesional
          </p>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <section className="hero-section">
            <div className="hero-content">
              <h2>Bienvenido a tu Portal de Empleados</h2>
              <p>
                Este sistema te permite gestionar toda la información de tu
                equipo de trabajo. Desde el registro de nuevos empleados hasta
                la actualización de datos existentes, todo está diseñado para
                ser simple, rápido y eficiente.
              </p>
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-number">{empleados.length}</div>
                  <div className="stat-label">Empleados Activos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    ${getTotalSalarios().toLocaleString()}
                  </div>
                  <div className="stat-label">Total en Salarios</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    ${getPromedioSalarios().toLocaleString()}
                  </div>
                  <div className="stat-label">Salario Promedio</div>
                </div>
              </div>
            </div>
          </section>

          <section className="actions-section">
            <div className="section-header">
              <div className="section-title">
                <h2>Gestión de Empleados</h2>
                <p>Administra la información de tu equipo de trabajo</p>
              </div>
              <button
                className="btn btn-primary btn-large"
                onClick={() => setShowForm(true)}
              >
                <span className="btn-icon">➕</span>
                Añadir Nuevo Empleado
              </button>
            </div>

            {showForm && (
              <div className="form-container">
                <div className="form-header">
                  <h3>
                    {editingId ? "✏️ Editar Empleado" : "👤 Nuevo Empleado"}
                  </h3>
                  <p>
                    {editingId
                      ? "Actualiza la información del empleado seleccionado"
                      : "Completa el formulario para registrar un nuevo empleado en el sistema"}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="empleado-form">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingresa el nombre del empleado"
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
                      placeholder="Ingresa el apellido del empleado"
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
                      placeholder="Ingresa el número de DNI"
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
                      placeholder="Ingresa el salario mensual"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                      <span className="btn-icon">
                        {editingId ? "💾" : "✨"}
                      </span>
                      {editingId ? "Actualizar Empleado" : "Crear Empleado"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      <span className="btn-icon">❌</span>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>

          <section className="employees-section">
            <div className="section-header">
              <h2>Directorio de Empleados</h2>
              <p>
                {empleados.length === 0
                  ? "No hay empleados registrados en el sistema. ¡Comienza agregando el primero!"
                  : `Mostrando ${empleados.length} empleado${
                      empleados.length !== 1 ? "s" : ""
                    } registrado${
                      empleados.length !== 1 ? "s" : ""
                    } en el sistema`}
              </p>
            </div>

            <div className="empleados-list">
              {empleados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No hay empleados registrados</h3>
                  <p>Comienza creando el primer empleado en tu sistema</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Crear Primer Empleado
                  </button>
                </div>
              ) : (
                empleados.map((empleado) => (
                  <div key={empleado.id} className="empleado-card">
                    <div className="empleado-header">
                      <div className="empleado-avatar">
                        {empleado.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="empleado-status">
                        <span className="status-dot"></span>
                        Activo
                      </div>
                    </div>
                    <div className="empleado-info">
                      <h4>{empleado.nombre_completo}</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">📋 DNI:</span>
                          <span className="info-value">{empleado.dni}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">💰 Salario:</span>
                          <span className="info-value">
                            ${parseFloat(empleado.salario).toLocaleString()}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">📅 Registrado:</span>
                          <span className="info-value">Hoy</span>
                        </div>
                      </div>
                    </div>
                    <div className="empleado-actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(empleado)}
                        title="Editar información del empleado"
                      >
                        <span className="btn-icon">✏️</span>
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteClick(empleado)}
                        title="Eliminar empleado del sistema"
                      >
                        <span className="btn-icon">🗑️</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="footer-section">
            <div className="footer-content">
              <h3>¿Necesitas ayuda?</h3>
              <p>
                Si tienes alguna pregunta sobre el uso del sistema o necesitas
                asistencia técnica, no dudes en contactar al equipo de soporte.
              </p>
              <div className="footer-features">
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>Datos seguros y protegidos</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Respuesta rápida y eficiente</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📱</span>
                  <span>Acceso desde cualquier dispositivo</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>⚠️ Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que quieres eliminar a{" "}
                <strong>{deleteName}</strong> del sistema?
              </p>
              <p className="warning-text">
                <strong>⚠️ Atención:</strong> Esta acción no se puede deshacer y
                se eliminarán todos los datos asociados al empleado de forma
                permanente.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                <span className="btn-icon">❌</span>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                <span className="btn-icon">🗑️</span>
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
