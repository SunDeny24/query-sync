import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
//import { fakeQueryData } from "./data/mockData.js"; 삭제
import AddQuery from "./pages/AddQuery.jsx";

function App() {
  //쿼리리스트 데이터 api 비동기 통신으로 받기
  const [queryList, setQueryList] = useState([]);

  //  const today = new Date().toISOString().slice(0, 19).replace("T", " ");
  useEffect(() => {
    const fetchData = async () => {
      try {
        //resultRes : 원시데이터
        //defRes : json 실행한 데이터
        //queryResults : 실행될 데이터json
        //queryDefinitions : 보여줄 리스트 데이터json
        const [resultsRes, defsRes] = await Promise.all([
          fetch("http://localhost:3001/queryResults"),
          fetch("http://localhost:3001/queryDefinitions"),
        ]);

        //통신된 데이터 받아오기
        const results = await resultsRes.json();
        const definitions = await defsRes.json();

        //console.log("results : ", results[0].id);

        //데이터합치기 : 동일한 id값을 찾아서 queryResults에 queryDefinitions을 합쳐준다.
        const mergeData = results.map((result) => {
          const definition = definitions.find(
            (definit) => result.id === definit.id,
          );
          return { ...result, name: definition ? definition.name : "이름없음" };
        });

        // 합쳐진 데이터로 state 업데이트
        setQueryList(mergeData);
      } catch (err) {
        console.error("에러발생 ", err);
      }
    };

    fetchData();
  }, []);

  /*====================AddQuery 된 부분 추가 예정============================ */
  //AddQuery에서 리스트 추가하는 함수
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

  /*===================AddQuery 된 부분 추가 예정============================ */

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
