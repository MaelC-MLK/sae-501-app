
"use client"; 

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getBearerToken } from '@/lib/utils';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = '1'; // Remplacez par l'ID de l'utilisateur que vous souhaitez récupérer

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const api = 'http://localhost:8080';
        const url = `${api}/api/users/${userId}`;
        const token = getBearerToken();

        if(!token) {
          throw new Error('No token found');
      }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image src="/images/event.jpg" alt="Profile Picture" layout="fill" objectFit="cover" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.id}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Email:</span>
            <p className="text-gray-700">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}