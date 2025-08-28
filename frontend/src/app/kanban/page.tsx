"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '../../components/TaskCard';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
}

const KanbanPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/tasks/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const renderTasks = (status: 'todo' | 'in-progress' | 'done') => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => <TaskCard key={task.id} {...task} />);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">Kanban Board</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
            <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">To Do</h2>
                <div className="flex flex-col gap-4">
                    {renderTasks('todo')}
                </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">In Progress</h2>
                <div className="flex flex-col gap-4">
                    {renderTasks('in-progress')}
                </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Done</h2>
                <div className="flex flex-col gap-4">
                    {renderTasks('done')}
                </div>
            </div>
        </div>
    </main>
  );
};

export default KanbanPage;
