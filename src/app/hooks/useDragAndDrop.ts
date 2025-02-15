import { useState } from "react";
import {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, SetColumnsType, SetTasksType, Task } from "../types/types";

type UseDragAndDropProps = {
  columns: Column[];
  setColumns: SetColumnsType;
  setTasks: SetTasksType;
  tasks: Task[];
};

export const useDragAndDrop = ({
  columns,
  setColumns,
  tasks,
  setTasks,
}: UseDragAndDropProps) => {
  const [columnActive, setColumnActive] = useState<Column | null>(null);
  const [taskActive, setTaskActive] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { type, column, task } = event.active.data?.current || {};
    if (type === "Column") setColumnActive(column);
    if (type === "Task") setTaskActive(task);
  };

  const moveTask = (activeId: string, overId: string) => {
    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    const overIndex = tasks.findIndex((task) => task.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[activeIndex] = {
        ...updatedTasks[activeIndex],
        columnId: updatedTasks[overIndex].columnId,
      };
      return arrayMove(updatedTasks, activeIndex, overIndex);
    });
  };

  const moveColumn = (activeId: string, overId: string) => {
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex === -1 || overColumnIndex === -1) return;

    setColumns((prevColumns) =>
      arrayMove(prevColumns, activeColumnIndex, overColumnIndex)
    );
  };

  const moveTaskToColumn = (taskId: string, columnId: string) => {
    const activeIndex = tasks.findIndex((task) => task.id === taskId);

    if (activeIndex === -1) return;

    setTasks((prevTasks) => {
      return prevTasks.map((task, index) =>
        index === activeIndex ? { ...task, columnId } : task
      );
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setTaskActive(null);
    setColumnActive(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeId === overId) return;

    if (activeType === "Column" && overType === "Column") {
      moveColumn(activeId, overId);
    } else if (activeType === "Task" && overType === "Task") {
      moveTask(activeId, overId);
    } else if (activeType === "Task" && overType === "Column") {
      moveTaskToColumn(activeId, overId);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeId === overId) return;

    if (activeType === "Task" && overType === "Task") {
      moveTask(activeId, overId);
    } else if (activeType === "Task" && overType === "Column") {
      moveTaskToColumn(activeId, overId);
    }
  };

  return {
    columnActive,
    taskActive,
    sensors,
    onDragStart,
    onDragEnd,
    onDragOver,
  };
};
