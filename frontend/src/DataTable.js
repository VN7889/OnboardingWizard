// src/DataTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Data Table</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">About Me</th>
            <th className="border px-4 py-2">Street</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">State</th>
            <th className="border px-4 py-2">ZIP</th>
            <th className="border px-4 py-2">Birthdate</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.about_me || '-'}</td>
              <td className="border px-4 py-2">{user.street || '-'}</td>
              <td className="border px-4 py-2">{user.city || '-'}</td>
              <td className="border px-4 py-2">{user.state || '-'}</td>
              <td className="border px-4 py-2">{user.zip || '-'}</td>
              <td className="border px-4 py-2">{user.birthdate || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;