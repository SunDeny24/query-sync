import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddQuery({ onAdd }) {
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  const navigate = useNavigate(); //네비게이터 추가

  const handleSubmit = (e) => {
    e.preventDefault(); //submit 이벤트 막기

    //★ 입력유효성검증코드 추가하기

    //newQuery : 폼 입력값 객체로 생성
    const newQueryData = {
      id: queryId,
      name: queryName,
      query: sqlQuery,
    };

    onAdd(newQueryData);
    navigate("/"); //다시 대시보드로
  };

  return (
    <div>
      <Link to="/">
        <button className="rounded border border-blue-500 bg-transparent px-3 py-1 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
          x
        </button>
      </Link>
      <h1 className="col-span-2 py-3 text-left text-2xl font-bold">쿼리정보</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 border">
        <div className="">
          <label className="px-3">쿼리 ID</label>
          <input
            type="text"
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            className="rounded border border-gray-300 bg-gray-50 p-2 text-gray-900"
          />
        </div>
        <div className="">
          <label className="px-3">쿼리 이름</label>
          <input
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            className="rounded border border-gray-300 bg-gray-50 p-2 text-gray-900"
          />
        </div>
        <div className="col-span-2">
          <label className="block px-3 py-5 text-left">SQL 쿼리</label>
          <textarea
            type="textarea"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50 text-gray-900"
          />
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuery;
