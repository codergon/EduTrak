export interface TodoItemProp {
  index: number;
  item: { id: string; done: boolean; due: string; todo: string };
}

export interface TaskItemProp {
  index: number;
  item: { id: string; due: string; course: string; lecturer: string };
}
