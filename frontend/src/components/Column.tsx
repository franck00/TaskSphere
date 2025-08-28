
"use client";

import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
}

interface ColumnProps {
  status: 'todo' | 'in-progress' | 'done';
  tasks: Task[];
  onDrop: (id: string, status: 'todo' | 'in-progress' | 'done') => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 bg-gray-100 rounded-lg transition-colors ${isOver ? 'bg-gray-200' : ''}`}
    >
      <h2 className="text-2xl font-bold mb-4 capitalize">{status.replace('-', ' ')}</h2>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
