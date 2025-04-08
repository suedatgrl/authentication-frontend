import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

class AuthService {
  constructor() {
    // Axios varsayılan ayarlar
    axios.defaults.withCredentials = true; 
    // NTLM kimlik bilgilerinin gönderilmesi için gerekli. bu waffleın içindeki kütüphane
    // Kerberos da mümkün ama eklemedim 
  }

  //current user get et aşko
  getCurrentUser() {
    return axios.get(API_URL + 'user')
      .then(response => {
        console.log('User info retrieved successfully', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Error retrieving user info', error);
        throw error;
      });
  }

  
  logout() {
    return axios.post(API_URL + 'logout')
      .then(response => {
        console.log('Logout successful', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Error during logout', error);
        throw error;
      });
  }

  // user check 
  isAuthenticated() {
    return axios.get(API_URL + 'auth/status')
      .then(response => {
        console.log('Auth status checked', response.data);
        return response.data.authenticated;
      })
      .catch(error => {
        console.error('Error checking auth status', error);
        return false;
      });
  }

  // start Windows Authentication 
  initiateWindowsAuth() {
    return axios.get(API_URL + 'auth/windows', {
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(response => {
      console.log('Windows auth initiated', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error initiating Windows auth', error);
      throw error;
    });
  }

  // check roles aşko
  hasRole(role) {
    return this.getCurrentUser()
      .then(user => {
        if (!user || !user.authorities) return false;
        return user.authorities.some(auth => auth.authority === role);
      })
      .catch(() => {
        return false;
      });
  }
}

export default new AuthService();