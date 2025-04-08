import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Windows Authentication'ı başlat
    AuthService.initiateWindowsAuth()
      .then(() => {
        // Kimlik doğrulama durumunu kontrol et
        return AuthService.isAuthenticated();
      })
      .then(isAuth => {
        if (isAuth) {
          navigate('/');
        } else {
          setError('Windows kimlik doğrulama başarısız. Lütfen ağ yapılandırmanızı kontrol edin.');
        }
      })
      .catch(err => {
        setError('Kimlik doğrulama sırasında bir hata oluştu: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Windows Authentication</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <p>Windows kimlik doğrulama işlemi yapılıyor...</p>
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="alert alert-success">
              Kimlik doğrulama başarılı! Yönlendiriliyorsunuz...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;