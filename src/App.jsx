import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
import AddQuery from "./pages/AddQuery.jsx";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [queryList, setQueryList] = useState([]); //쿼리리스트

  //현재시각
  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  //쿼리리스트 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/queryMaster`);

        //통신된 데이터 받아오기
        const results = await res.json();

        setQueryList(results);
      } catch (err) {
        console.error("리스트 조회시 에러발생 ", err);
      }
    };

    fetchData();
  }, []);

  //쿼리ID 생성함수
  const generateNewId = (list) => {
    if (list.length === 0) {
      console.log("데이터없으면 초기화: Q0001");
      return "Q0001";
    }
    //정수추출
    const num = list.map((item) => parseInt(item.id.replace("Q", ""), 10));
    //최대값 가져오기
    const maxNum = Math.max(...num);
    //새로운 번호 생성
    const newNum = maxNum + 1;
    //번호포맷생성
    const newId = "Q" + String(newNum).padStart(4, "0");
    return newId;
  };

  //AddQuery에서 쿼리리스트 추가하는 함수
  const saveAddQuery = async (newQueryData) => {
    try {
      const newId = generateNewId(queryList); //채번

      const addData = {
        id: newId,
        createDt: today,
        modiDt: null,
        ...newQueryData,
      };

      //새로운 쿼리 저장
      const res = await fetch(`${apiUrl}/queryMaster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addData),
      });

      const saveResult = await res.json();

      setQueryList((prev) => [...prev, saveResult]);
    } catch (error) {
      console.log("쿼리 저장시 saveAddQuery 에러 : ", error);
    }
  };

  //상세보기시 데이터 수정하는 함수
  const editAddQuery = async (editQueryData, id) => {
    try {
      const editData = {
        modiDt: today,
        ...editQueryData,
      };

      const res = await fetch(`${apiUrl}/queryMaster/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const editResult = await res.json();
      console.log("editResult : ", editResult);

      setQueryList((prev) =>
        prev.map((item) => (item.id === editResult.id ? editResult : item)),
      );
    } catch (error) {
      console.log("쿼리 수정시 editAddQuery 에러 : ", error);
    }
  };

  //데이터 삭제기능
  const deleteQuery = async (id) => {
    try {
      //console.log(id, " 삭제함");
      const res = await fetch(`${apiUrl}/queryMaster/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("서버에서 삭제를 실패하였습니다.");
      }
      setQueryList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log("삭제시 deleteQuery 에러 : ", error);
    }
  };

  //쿼리실행결과 리스트 반영하기
  const updateQueryList = (id, newResult) => {
    console.log("setQueryList 반영");
    setQueryList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, result: newResult } : item,
      ),
    );
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard list={queryList} />} />
        <Route path="/add" element={<AddQuery onAdd={saveAddQuery} />} />
        <Route
          path="/add/:id"
          element={
            <AddQuery
              onEdit={editAddQuery}
              onDelete={deleteQuery}
              onRunQuery={updateQueryList}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
