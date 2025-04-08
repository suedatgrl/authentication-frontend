import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';

const Home = ({ user }) => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Hoş Geldiniz!</h1>
        <p className="lead">
          Bu uygulamada Windows Authentication kullanarak güvenli oturum açtınız tebriks.
        </p>
        <hr className="my-4" />
        {user ? (
          <div>
            <p>{user.username} olarak oturum açtınız.</p>
            <Link to="/profile" className="btn btn-primary mr-2">
              Profil
            </Link>
            <button 
              className="btn btn-secondary" 
              onClick={() => AuthService.logout().then(() => window.location.reload())}
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <p>
            Windows Authentication ile otomatik olarak oturum açılır. Eğer oturum açılmadıysa, 
            <Link to="/login"> oturum aç</Link> sayfasına gidebilirsiniz.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;


