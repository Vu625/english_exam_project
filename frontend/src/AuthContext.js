// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Import auth từ file firebase.js
import { onAuthStateChanged } from 'firebase/auth'; // Import để lắng nghe trạng thái xác thực

// Tạo AuthContext
const AuthContext = createContext();

// Hook tùy chỉnh để sử dụng AuthContext một cách dễ dàng
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider để cung cấp trạng thái xác thực cho các component con
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Lưu trữ thông tin người dùng hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái tải (đang kiểm tra xác thực ban đầu)

  useEffect(() => {
    // onAuthStateChanged sẽ lắng nghe mọi thay đổi về trạng thái xác thực
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Đã có thông tin người dùng (hoặc null), không còn tải
    });

    // Clean-up function: hủy đăng ký lắng nghe khi component unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Chỉ render children khi đã kiểm tra xong trạng thái xác thực */}
    </AuthContext.Provider>
  );
}