"use client";

import React, { useState } from "react";
import { Column, Id, Task } from "../types/types";
import TrashIcon from "../Icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../Icons/PlusIcon";
import TaskCard from "./TaskCard";

type Props = {
  column: Column;
  handleDeleteColumn: (id: Id) => void;
  handleTitleEditChange: (id: Id, title: string) => void;
  handleCreateTask: (id: Id) => void;
  tasks: Task[];
  handleDeleteTask: (id: Id) => void;
  handleUpdateTaskChange: (id: Id, content: string) => void;
};

function ColumnContainer({
  handleTitleEditChange,
  handleUpdateTaskChange,
  handleDeleteTask,
  handleDeleteColumn,
  column,
  handleCreateTask,
  tasks,
}: Props) {
  const [edit, setEdit] = useState(false);

  const {
    isDragging,
    transform,
    transition,
    setNodeRef,
    attributes,
    listeners,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: edit,
  });

  const taskIds = tasks.map((task) => task.id);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columBackgroundColor w-[350px] h-[500px]  rounded-md  flex flex-col opacity-40 border-rose-500 border-2"
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columBackgroundColor w-[350px] h-[500px]  rounded-md  flex flex-col"
    >
      <div
        onClick={() => {
          setEdit(true);
        }}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grap rounded-md rounded-b-none p-3 font-bold border-columBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center px-2 py-1 text-sm bg-columBackgroundColor rounded-full">
            {taskIds.length}
          </div>
          {!edit && column.title}
          {edit && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => {
                handleTitleEditChange(column.id, e.target.value);
              }}
              autoFocus
              onBlur={() => {
                setEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEdit(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            handleDeleteColumn(column.id);
          }}
          className="stroke-gray-500 hover:stroke-white hover:bg-columBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDeleteTask={handleDeleteTask}
              handleUpdateTaskChange={handleUpdateTaskChange}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          handleCreateTask(column.id);
        }}
        className="flex gap-2 items-center  border-columBackgroundColor border-2 rounded-md p-4 border-x-columBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PlusIcon /> 할일 추가
      </button>
    </div>
  );
}

export default ColumnContainer;
