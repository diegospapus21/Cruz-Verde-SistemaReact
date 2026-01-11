import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, UserX, MapPin } from 'lucide-react';
import { getVolunteers, toggleVolunteerStatus, getAllAttendances } from '../../Services/api';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [volunteersRes, attendancesRes] = await Promise.all([
        getVolunteers(),
        getAllAttendances()
      ]);
      
      setVolunteers(volunteersRes.data.data);
      setAttendances(attendancesRes.data.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (volunteerId) => {
    try {
      await toggleVolunteerStatus(volunteerId);
      await loadData();
      
      if (selectedVolunteer?._id === volunteerId) {
        const updated = volunteers.find(v => v._id === volunteerId);
        setSelectedVolunteer({ ...updated, active: !updated.active });
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado del voluntario');
    }
  };

  const getVolunteerAttendances = (volunteerId) => {
    return attendances.filter(a => a.userId?._id === volunteerId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando voluntarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Gestión de Voluntarios</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Voluntarios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Lista de Voluntarios ({volunteers.length})
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {volunteers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay voluntarios registrados</p>
            ) : (
              volunteers.map(volunteer => {
                const volAttendances = getVolunteerAttendances(volunteer._id);
                return (
                  <div
                    key={volunteer._id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedVolunteer?._id === volunteer._id
                        ? 'border-green-500 bg-green-50'
                        : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedVolunteer(volunteer)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{volunteer.name}</p>
                        <p className="text-sm text-gray-500">{volunteer.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {volAttendances.length} asistencias
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {volunteer.active ? (
                          <span className="text-green-600 text-sm flex items-center gap-1">
                            <CheckCircle size={16} />
                            Activo
                          </span>
                        ) : (
                          <span className="text-red-600 text-sm flex items-center gap-1">
                            <XCircle size={16} />
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(volunteer._id);
                      }}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                        volunteer.active
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {volunteer.active ? (
                        <span className="flex items-center justify-center gap-2">
                          <UserX size={16} />
                          Deshabilitar
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle size={16} />
                          Habilitar
                        </span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detalles del Voluntario */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedVolunteer ? `Detalles de ${selectedVolunteer.name}` : 'Selecciona un voluntario'}
          </h3>
          
          {selectedVolunteer ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Información Personal</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{selectedVolunteer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correo:</span>
                    <span className="font-medium text-sm">{selectedVolunteer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedVolunteer.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedVolunteer.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-2">Estadísticas</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600">Total Asistencias</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {getVolunteerAttendances(selectedVolunteer._id).length}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600">Horas Totales</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {(getVolunteerAttendances(selectedVolunteer._id)
                        .reduce((sum, a) => sum + (a.duration || 0), 0) / 60).toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-gray-700">Últimas Asistencias</h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {getVolunteerAttendances(selectedVolunteer._id).length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Sin registros</p>
                  ) : (
                    getVolunteerAttendances(selectedVolunteer._id).slice(0, 10).map(att => (
                      <div key={att._id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-700">
                            {new Date(att.checkIn).toLocaleDateString('es-ES')}
                          </span>
                          {att.duration && (
                            <span className="text-green-600 font-medium">
                              {Math.floor(att.duration / 60)}h {att.duration % 60}m
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Entrada:</span>
                            <span className="font-medium">
                              {new Date(att.checkIn).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {att.checkOut && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Salida:</span>
                              <span className="font-medium">
                                {new Date(att.checkOut).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="flex items-start gap-1 text-xs text-gray-600">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                            <span>{att.locationIn.address}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              Haz clic en un voluntario para ver sus detalles
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagement;