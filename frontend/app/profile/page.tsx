import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const events = [
  { id: 1, name: 'Event 1', date: '2023-10-01' },
  { id: 2, name: 'Event 2', date: '2023-10-02' },
  { id: 3, name: 'Event 3', date: '2023-10-03' },
  { id: 4, name: 'Event 4', date: '2023-10-04' },
  { id: 5, name: 'Event 5', date: '2023-10-05' },
  { id: 6, name: 'Event 6', date: '2023-10-06' },
  { id: 7, name: 'Event 7', date: '2023-10-07' },
  { id: 8, name: 'Event 8', date: '2023-10-08' },
  { id: 9, name: 'Event 9', date: '2023-10-09' },
  { id: 10, name: 'Event 10', date: '2023-10-10' },
];

const connections = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
  { id: 3, firstName: 'Alice', lastName: 'Johnson' },
];



export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const userId = '1'; // Remplacez par l'ID de l'utilisateur que vous souhaitez récupérer

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const api = 'http://localhost:8080';
//         const url = `${api}/api/users/${userId}`;

//         const response = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/ld+json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Erreur lors de la récupération des données utilisateur');
//         }

//         const data = await response.json();
//         setUser(data);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError('An unknown error occurred');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   if (loading) {
//     return <div>Chargement...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

  return (
    <div className="flex  items-center bg-gray-50 min-h-screen py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image src="/images/event.jpg" alt="Profile Picture" layout="fill" objectFit="cover" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Mathis</h2>
          <p className="text-gray-400">#EFQF8EA13</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Email:</span>
            <p className="text-gray-700">mathis.micheau14@gmail.com</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Connexions:</span>
            <p className="text-gray-700">mathis.micheau14@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <h2 className="mt-4 text-xl font-semibold">Last Event</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <h2 className="mt-4 text-xl font-semibold">Favorites Events</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}