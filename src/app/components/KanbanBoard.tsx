"use client";

import React, { useEffect, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import { Column, Id, Task } from "../types/types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { v4 as uuid } from "uuid";
import {
  STORAGE_KEY_COLUMNS,
  STORAGE_KEY_TASKS,
} from "../constants/kanbanbordKey";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem(STORAGE_KEY_COLUMNS);
    return savedColumns ? JSON.parse(savedColumns) : [];
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  const {
    columnActive,
    taskActive,
    sensors,
    onDragStart,
    onDragEnd,
    onDragOver,
  } = useDragAndDrop({
    columns,
    setColumns,
    tasks,
    setTasks,
  });

  const columnsId = columns.map((col) => col.id);

  const handleTitleEditChange = (id: Id, title: string) => {
    const newColumns = columns.map((col) =>
      col.id === id ? { ...col, title } : col
    );
    setColumns(newColumns);
  };

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: uuid(),
      columnId,
      content: `카드 ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: Id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const deleteColumn = (id: Id) => {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const handleUpdateTaskChange = (id: Id, content: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: uuid(),
      title: `제목 ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-auto px-[40px] justify-center">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  handleUpdateTaskChange={handleUpdateTaskChange}
                  handleDeleteTask={deleteTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  handleCreateTask={createTask}
                  handleTitleEditChange={handleTitleEditChange}
                  column={col}
                  key={col.id}
                  handleDeleteColumn={deleteColumn}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-md bg-mainBackgroundColor border-2 border-columBackgroundColor p-4 riging-roes-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            추가
          </button>
        </div>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {columnActive && (
                <ColumnContainer
                  key={columnActive.id}
                  handleUpdateTaskChange={handleUpdateTaskChange}
                  handleDeleteTask={deleteTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === columnActive.id
                  )}
                  handleCreateTask={createTask}
                  column={columnActive}
                  handleDeleteColumn={deleteColumn}
                  handleTitleEditChange={handleTitleEditChange}
                />
              )}
              {taskActive && (
                <TaskCard
                  key={taskActive.id}
                  task={taskActive}
                  handleDeleteTask={deleteTask}
                  handleUpdateTaskChange={handleUpdateTaskChange}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
