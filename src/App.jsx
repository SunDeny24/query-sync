import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
import { fakeQueryData } from "./data/mockData.js";
import AddQuery from "./pages/AddQuery.jsx";

function App() {
  //쿼리리스트 데이터 상태관리
  const [queryList, setQueryList] = useState(fakeQueryData);

  //AddQuery에서 리스트 추가
  const handleAddQuery = (newQueryData) => {
    // 전개구문 사용해서 불변데이터 업데이트하기
    const newQuery = [...queryList, newQueryData];
    setQueryList(newQuery);
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
