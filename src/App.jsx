import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
//import { fakeQueryData } from "./data/mockData.js"; 삭제
import AddQuery from "./pages/AddQuery.jsx";

function App() {
  const [queryList, setQueryList] = useState([]); //쿼리리스트
  const [queries, setQueries] = useState([]); // 쿼리 이력

  const today = new Date().toISOString().slice(0, 19).replace("T", " "); //날짜

  //쿼리리스트 데이터 api 비동기 통신으로 받기
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
  const handleAddQuery = async (newQueryData) => {
    try {
      const newId = generateNewId(queryList); //채번
      console.log("queryList : ", queryList);

      //1. 저장 객체(정의)
      const addDefintionData = {
        id: newId,
        ...newQueryData,
      };
      //2. 저장 객체(결과)
      const resultData = {
        id: newId,
        lastRun: today,
        status: null,
        resultData: [],
        error: null,
      };

      //1,2 객체 저장
      const [defResponse, resResponse] = await Promise.all([
        fetch("http://localhost:3001/queryDefinitions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addDefintionData),
        }),
        fetch("http://localhost:3001/queryResults", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultData),
        }),
      ]);

      const saveDefResult = await defResponse.json();
      const saveResResult = await resResponse.json();

      //결과 합치기
      const newQuery = {
        ...saveResResult,
        name: saveDefResult.name,
      };
      console.log(newQuery);

      setQueryList((prev) => [...prev, newQuery]);
    } catch (error) {
      console.log("쿼리 저장시 handleAddQuery 에러 : ", error);
    }
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
