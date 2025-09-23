import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddQuery({ onAdd }) {
  const [queryName, setQueryName] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");

  const navigate = useNavigate(); //네비게이터 추가

  const handleSubmit = (e) => {
    e.preventDefault(); //submit 이벤트 막기

    //유효성 검사
    if (!queryName.trim() || !sqlQuery.trim()) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    //newQuery : 폼 입력값 객체로 생성
    const newQueryData = {
      name: queryName,
      query: sqlQuery,
    };

    onAdd(newQueryData);
    navigate("/"); //다시 대시보드로
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-lg border bg-white shadow">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h1 className="text-2xl font-bold">쿼리 정보</h1>
          <div className="flex gap-2">
            <button className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300">
              수정
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
            >
              저장
            </button>
            <Link to="/">
              <button className="rounded border border-blue-500 bg-transparent px-3 py-1 font-semibold text-blue-700 hover:bg-blue-500 hover:text-white">
                닫기
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 p-6">
          <div className="col-span-2 space-y-5">
            {/* Query ID */}
            <div className="flex items-center gap-3">
              <label htmlFor="query-id" className="w-28 font-medium">
                쿼리 ID
              </label>
              <input
                type="text"
                id="query-id"
                disabled={true}
                className="flex-1 rounded border border-gray-300 bg-gray-100 p-2 text-gray-500"
              />
            </div>

            {/* Query Name */}
            <div className="flex items-center gap-3">
              <label htmlFor="query-name" className="w-28 font-medium">
                쿼리 이름
              </label>
              <input
                type="text"
                id="query-name"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="ex) 판매전환 중복건 검증"
                className="flex-1 rounded border border-gray-300 bg-gray-50 p-2 text-gray-900"
              />
            </div>

            {/* SQL Query */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="sql-query" className="font-medium">
                  SQL 쿼리
                </label>
                <button
                  type="button"
                  className="rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  쿼리 실행
                </button>
              </div>
              <textarea
                id="sql-query"
                rows="6"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="ex) SELECT * FROM sales WHERE status = 'CANCELLED'"
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900"
              />
            </div>

            {/* Result */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-medium">조회 결과</label>
                <div className="flex items-center gap-3">
                  <span>2025-08-27 10:36:35</span>
                  <span className="text-xl font-semibold text-red-600">
                    실패!
                  </span>
                </div>
              </div>
              <textarea
                id="query-result"
                rows="7"
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-700"
              />
            </div>

            {/* Condition */}
            <div>
              <label
                htmlFor="condition"
                className="mb-2 flex items-center font-medium"
              >
                조건
              </label>
              <textarea
                id="condition"
                rows="5"
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-900"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuery;
