import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, status, priority, due_date }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getStatusVariant = (currentStatus: string) => {
    switch (currentStatus) {
      case 'todo':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'done':
        return 'success';
      default:
        return 'outline';
    }
  };

  const getPriorityVariant = (currentPriority: string) => {
    switch (currentPriority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card
      ref={drag}
      className={`w-full ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between">
            <Badge variant={getStatusVariant(status)}>{status.replace('-', ' ')}</Badge>
            <Badge variant={getPriorityVariant(priority)}>{priority}</Badge>
        </div>
        {due_date && (
          <p className="text-sm text-gray-500">
            Due: {new Date(due_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
