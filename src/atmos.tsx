import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const categoryListState = atom<string[]>({
  key: "category",
  default: ["To Do", "Doing", "Done", "trash"],
});

const savedToDos = localStorage.getItem("toDos");
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: savedToDos
    ? JSON.parse(savedToDos)
    : { "To Do": [], Doing: [], Done: [], trash: [] },
});
