"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from '../../components/Column';

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

  const handleDrop = async (id: string, status: 'todo' | 'in-progress' | 'done') => {
    const token = localStorage.getItem('token');
    const task = tasks.find((t) => t.id === id);
    if (!task || !token) return;

    const updatedTask = { ...task, status };

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? updatedTask : t))
    );

    try {
      const response = await fetch(`http://localhost:8000/tasks/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
    } catch (e: any) {
      setError(e.message);
      // Revert the state if the API call fails
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? task : t))
      );
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl font-bold mb-8">Kanban Board</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          <Column
            status="todo"
            tasks={tasks.filter((t) => t.status === 'todo')}
            onDrop={handleDrop}
          />
          <Column
            status="in-progress"
            tasks={tasks.filter((t) => t.status === 'in-progress')}
            onDrop={handleDrop}
          />
          <Column
            status="done"
            tasks={tasks.filter((t) => t.status === 'done')}
            onDrop={handleDrop}
          />
        </div>
      </main>
    </DndProvider>
  );
};

export default KanbanPage;
