import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, accuracy_score

# Gürültü gidermek için filtreleme fonksiyonu
def smooth_data(data, window_size=3):
    return data.rolling(window=window_size).mean()

# Veri setini yükle
df = pd.read_csv("sensor_data.csv")  # CSV dosyanın adı
df['time'] = pd.to_datetime(df['time'])
df.set_index('time', inplace=True)

# Gürültü giderme (örneğin sıcaklık verisi için)
df['temperature_smoothed'] = smooth_data(df['temperature'])

# Sınıflandırma etiketi ekle (örnek: sıcaklık belirli bir değeri geçtiğinde 1, aksi halde 0)
threshold = 25
df['is_hot'] = (df['temperature_smoothed'] > threshold).astype(int)

# Veriyi normalize et
scaler = MinMaxScaler()
df_scaled = scaler.fit_transform(df[['temperature_smoothed']].dropna())

# RNN modeli için veri hazırlığı (X, y oluşturma)
def create_sequences(data, sequence_length):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i:i + sequence_length])
        y.append(data[i + sequence_length])
    return np.array(X), np.array(y)

sequence_length = 10
X, y = create_sequences(df_scaled, sequence_length)

# Eğitim ve test setlerini ayır
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# RNN Modeli
model = tf.keras.Sequential([
    tf.keras.layers.SimpleRNN(50, return_sequences=True, input_shape=(sequence_length, 1)),
    tf.keras.layers.SimpleRNN(50, return_sequences=False),
    tf.keras.layers.Dense(25, activation='relu'),
    tf.keras.layers.Dense(1)
])

# Modeli derleme
model.compile(optimizer='adam', loss='mean_squared_error')
model.summary()

# Modeli eğit
model.fit(X_train, y_train, epochs=20, batch_size=32, validation_data=(X_test, y_test))

# Tahmin yap
predictions = model.predict(X_test)
predictions_rescaled = scaler.inverse_transform(predictions)

# Performans metriği (Mean Squared Error)
mse = mean_squared_error(scaler.inverse_transform(y_test), predictions_rescaled)
print(f"Mean Squared Error: {mse}")

# Grafik Çizimi
plt.figure(figsize=(12, 6))
plt.plot(df.index[-len(predictions):], scaler.inverse_transform(y_test), label="Gerçek Değerler")
plt.plot(df.index[-len(predictions):], predictions_rescaled, label="RNN Tahminleri", linestyle='dashed')
plt.xlabel("Zaman")
plt.ylabel("Sıcaklık")
plt.legend()
plt.title("RNN ile Tahminleme")
plt.savefig("rnn_temperature_forecast.png")import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Profile = ({ user }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user) {
      AuthService.hasRole('ROLE_ADMINISTRATORS')
        .then(hasRole => setIsAdmin(hasRole));
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Kullanıcı Profili</h3>
        </div>
        <div className="card-body">
          <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
          <p><strong>Yetkiler:</strong></p>
          <ul>
            {user.authorities && user.authorities.map((auth, index) => (
              <li key={index}>{auth.authority}</li>
            ))}
          </ul>
          {isAdmin && (
            <div className="alert alert-info">
              Yönetici haklarına sahipsiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;