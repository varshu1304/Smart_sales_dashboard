import React from 'react';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800">
      <header className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white text-center">
       <h1
  className="text-2xl font-bold tracking-wide"
  style={{
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b", // optional: dark slate color
  }}
>
  🌟 JITech — Smart Sales Dashboard
</h1>

      </header>

      <main className="p-6">
        <Dashboard />
      </main>
    </div>
  );
}
