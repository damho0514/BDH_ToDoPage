export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

export type SetColumnsType = (
  value: Column[] | ((prevState: Column[]) => Column[])
) => void;
export type SetTasksType = (
  value: Task[] | ((prevState: Task[]) => Task[])
) => void;
