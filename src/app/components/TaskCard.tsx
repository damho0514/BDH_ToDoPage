import React, { useState } from "react";
import { Id, Task } from "../types/types";
import TrashIcon from "../Icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: Task;
  handleDeleteTask: (id: Id) => void;
  handleUpdateTaskChange: (id: Id, content: string) => void;
};
function TaskCard({ task, handleDeleteTask, handleUpdateTaskChange }: Props) {
  const [contentEdit, setContentEdit] = useState(false);

  const toggleEdit = () => {
    setContentEdit((prev) => !prev);
  };

  const {
    isDragging,
    transform,
    transition,
    setNodeRef,
    attributes,
    listeners,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: contentEdit,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab opacity-30 border-rose-500 border-2"
      />
    );
  }
  if (contentEdit) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          value={task.content}
          autoFocus
          placeholder="내용을 입력해주세요."
          onBlur={toggleEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEdit();
          }}
          onChange={(e) => {
            handleUpdateTaskChange(task.id, e.target.value);
          }}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEdit}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      <button
        onClick={() => {
          handleDeleteTask(task.id);
        }}
        className="stroke-white  bg-columBackgroundColor p-2  rounded opacity-60 hover:opacity-100 absolute right-4 top-1/2 -translate-y-1/2"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default TaskCard;
