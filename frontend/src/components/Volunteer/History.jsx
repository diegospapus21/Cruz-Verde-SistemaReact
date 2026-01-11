import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { getMyAttendances } from '../../Services/api';

const History = () => {
  const [attendances, setAttendances] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const response = await getMyAttendances();
      setAttendances(response.data.data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAttendances = () => {
    const now = new Date();
    
    if (filter === 'all') return attendances;
    
    if (filter === 'month') {
      return attendances.filter(a => {
        const date = new Date(a.checkIn);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });
    }
    
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return attendances.filter(a => new Date(a.checkIn) >= weekAgo);
    }
    
    return attendances;
  };

  const filtered = getFilteredAttendances();

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Historial de Asistencias</h2>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition ${
              filter === 'month' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Este Mes
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition ${
              filter === 'week' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Esta Semana
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando historial...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No hay registros para mostrar</p>
            ) : (
              filtered.map(att => {
                const duration = att.duration 
                  ? `${Math.floor(att.duration / 60)}h ${att.duration % 60}m`
                  : 'En curso';

                return (
                  <div key={att._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="text-green-600" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fecha</p>
                          <p className="font-bold text-gray-800">
                            {new Date(att.checkIn).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {att.duration && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Duración</p>
                          <p className="font-bold text-green-600 text-lg">{duration}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-green-600" size={18} />
                          <p className="text-xs text-green-600 font-medium">ENTRADA</p>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          {new Date(att.checkIn).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{att.locationIn.address}</span>
                        </p>
                      </div>

                      {att.checkOut ? (
                        <div className="bg-red-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-red-600" size={18} />
                            <p className="text-xs text-red-600 font-medium">SALIDA</p>
                          </div>
                          <p className="text-lg font-bold text-red-700">
                            {new Date(att.checkOut).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                            <span>{att.locationOut.address}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                          <p className="text-blue-600 font-medium">Sesión en curso</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;