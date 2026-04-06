import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

const savedCategory = localStorage.getItem("categoryList");
export const categoryListState = atom<string[]>({
  key: "categoryList",
  default: savedCategory
    ? JSON.parse(savedCategory)
    : ["To Do", "Doing", "Done"],
});

const savedToDos = localStorage.getItem("toDos");
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: savedToDos
    ? JSON.parse(savedToDos)
    : { "To Do": [], Doing: [], Done: [], trash: [] },
});
