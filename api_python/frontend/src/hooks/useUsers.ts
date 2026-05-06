'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User, UserCreate } from '@/types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: UserCreate) => {
    try {
      const newUser = await api.post('/users', userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear usuario');
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const updatedUser = await api.put(`/users/${id}`, userData);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar usuario');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
