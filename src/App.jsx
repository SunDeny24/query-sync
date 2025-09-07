import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
import { fakeQueryData } from "./data/mockData.js";
import AddQuery from "./pages/AddQuery.jsx";

function App() {
  //쿼리리스트 데이터 상태관리
  const [queryList, setQueryList] = useState(fakeQueryData);
  const today = new Date().toISOString().slice(0, 19).replace("T", " ");

  //AddQuery에서 리스트 추가
  const handleAddQuery = (newQueryData) => {
    //api로 전송할 데이터 받아오기
    const apiResult = {
      lastRun: today,
      status: true, //임시로 불리언값 넘기기
    };
    console.log("apiResult : ", apiResult);

    //최종결과 합치기
    const finalResult = {
      ...newQueryData,
      ...apiResult,
    };

    setQueryList([...queryList, finalResult]);
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard list={queryList} />} />
        <Route path="/add" element={<AddQuery onAdd={handleAddQuery} />} />
      </Routes>
    </div>
  );
}

export default App;
