import React from 'react';
import UserList from '../Admin/UserList';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-4xl font-bold my-8">Panel de Administración</h1>
      <UserList />
    </div>
  );
};

export default AdminPage;
