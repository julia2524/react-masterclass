import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { categoryListState, toDoState } from "./atmos";
import Board from "./Components/Board";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 30vh;
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;
const Form = styled.form`
  margin-top: 50px;
  margin-left: 50px;
  input {
    border: none;
    padding: 10px;
    border-radius: 10px;
  }
  button {
    padding: 8px;
    margin-left: 5px;
    border-radius: 15px;
    border: solid 1px ${(props) => props.theme.cardColor};
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.cardColor};
  }
`;
const Trash = styled.div`
  border: 1px dashed rgba(0, 0, 0, 0.3);
  height: 150px;
  width: 150px;
  background-color: transparent;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  margin: 50px 0 0 50px;
  justify-content: flex-end;
  transition: backgrond-color 0.3s, transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;
const Title = styled.h2`
  font-weight: 700;
  font-size: 70px;
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
`;
interface IForm {
  category: string;
}
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Area = styled.div<IAreaProps>`
  padding: 20px;
  height: 120px;
  width: 120px;

  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  transition: 0.5s ease-in;
`;
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const setCategoryList = useSetRecoilState(categoryListState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ category }: IForm) => {
    setCategoryList((allCategory) => {
      return [...allCategory, category];
    });

    console.log(category);
    setToDos((allBoards) => {
      return { ...allBoards, [category]: [] };
    });
    setValue("category", "");
  };
  useEffect(() => {
    localStorage.setItem("toDos", JSON.stringify(toDos));
  }, [toDos]);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
      console.log(toDos);
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      //same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("category", { required: true })}
          type="text"
          placeholder="Write a new category..."
        />
        <button type="submit">Add</button>
      </Form>
      <DragDropContext onDragEnd={onDragEnd}>
        <Trash>
          <Droppable droppableId="trash">
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                <Title>🗑</Title>
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Trash>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}
export default App;
