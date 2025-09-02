import { useState } from 'react';
import {Routes,Route} from "react-router-dom";
import './App.css';
import Dashboard from "./pages/Dashboard.jsx";
import { fakeQueryData } from './data/mockData.js';
import AddQuery from './pages/AddQuery.jsx';

function App() {
  //쿼리리스트 데이터 상태관리
  const [queryList, setQueryList] = useState(fakeQueryData);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard list = {queryList} />} />
        <Route path="/add" element={<AddQuery />} />
      </Routes>
    </div>
  )
}

export default App;
