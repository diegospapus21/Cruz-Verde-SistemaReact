import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { checkIn, checkOut, getActiveAttendance, getMyAttendances } from '../../Services/api';

const AttendanceControl = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [todayAttendances, setTodayAttendances] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activeRes, allRes] = await Promise.all([
        getActiveAttendance(),
        getMyAttendances()
      ]);
      
      setActiveSession(activeRes.data.data);
      
      const today = allRes.data.data.filter(a => {
        const date = new Date(a.checkIn);
        const now = new Date();
        return date.toDateString() === now.toDateString();
      });
      setTodayAttendances(today);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocalización no disponible en tu navegador');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          reject('Error obteniendo ubicación. Por favor habilita los permisos de ubicación.');
        }
      );
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const location = await getLocation();
      await checkIn(location);
      setMessage({ type: 'success', text: '✓ Entrada registrada exitosamente' });
      await loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.toString() 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const location = await getLocation();
      await checkOut(activeSession._id, location);
      setMessage({ type: 'success', text: '✓ Salida registrada exitosamente' });
      await loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.toString() 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Control de Asistencia</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Clock size={64} className="text-green-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {activeSession ? 'Sesión Activa' : 'Sin Sesión Activa'}
          </h3>

          {activeSession && (
            <div className="mb-6">
              <p className="text-gray-600">Entrada registrada a las:</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {new Date(activeSession.checkIn).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                <MapPin size={16} />
                {activeSession.locationIn.address}
              </p>
            </div>
          )}

          <button
            onClick={activeSession ? handleCheckOut : handleCheckIn}
            disabled={loading}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg ${
              activeSession
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              'Procesando...'
            ) : activeSession ? (
              'Registrar Salida'
            ) : (
              'Registrar Entrada'
            )}
          </button>

          {message.text && (
            <div className={`mt-6 p-4 rounded-lg flex items-center justify-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Asistencias de Hoy</h3>
        <div className="space-y-3">
          {todayAttendances.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay registros para hoy</p>
          ) : (
            todayAttendances.map(att => (
              <div key={att._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-800">Entrada</p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Date(att.checkIn).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {att.checkOut && (
                    <div className="text-right">
                      <p className="font-medium text-gray-800">Salida</p>
                      <p className="text-2xl font-bold text-red-600">
                        {new Date(att.checkOut).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Entrada: {att.locationIn.address}</span>
                  </p>
                  {att.locationOut && (
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Salida: {att.locationOut.address}</span>
                    </p>
                  )}
                  {att.duration && (
                    <p className="text-purple-600 font-medium">
                      Duración: {Math.floor(att.duration / 60)}h {att.duration % 60}m
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceControl;