import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddQuery({ onAdd, onEdit }) {
  /* State 관리데이터(저장될데이터) */
  const [queryId, setQueryId] = useState("");
  const [queryName, setQueryName] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [lastRun, setLastRun] = useState("");
  const [status, setStatus] = useState("");
  const [resultData, setresultData] = useState("");
  const [createDt, setcreateDt] = useState("");
  const [lastModiDt, setlastModiDt] = useState("");
  const [originResult, setOriginResult] = useState(null);

  const navigate = useNavigate(); //네비게이터 추가
  const { id } = useParams(); //수정, 보기모드시 사용
  const isEditMode = Boolean(id); //입력, 수정모드

  //수정모드일때 데이터조회
  useEffect(() => {
    const fetchData = async () => {
      console.log(id, "의 수정모드");
      try {
        const res = await fetch(`http://localhost:3001/queryMaster/${id}`);
        if (!res.ok) {
          throw new Error("데이터 불러오는데 실패했습니다.");
        }
        //통신된 데이터 받아오기
        const results = await res.json();
        setQueryId(results.id);
        setQueryName(results.name);
        setSqlQuery(results.query);
        //setStatus(results.resultData);
        setcreateDt(results.createDt);
        setlastModiDt(results.lastModiDt);

        //result 객체 따로 셋팅
        setOriginResult(results.result);
        if (results.result) {
          setLastRun(results.result.lastRun || "");
          setStatus(results.result.status);
        }
      } catch (error) {
        console.log("데이터로딩중 에러 : ", error);
      }
    };
    if (!isEditMode) {
      console.log("입력모드");
    } else {
      fetchData();
    }
  }, [id, isEditMode]);

  /* form 저장 이벤트 */
  const handleSubmit = (e) => {
    e.preventDefault();

    //입력모드
    if (!isEditMode) {
      //유효성 검사
      if (!queryName.trim() || !sqlQuery.trim()) {
        alert("모든 필드를 입력해주세요!");
        return;
      }
      //폼 입력값
      const newQueryData = {
        name: queryName,
        query: sqlQuery,
        result: {
          lastRun: null, //추후 실행버튼 구현시 수정
          status: null,
          resultData: [],
          error: null,
        },
      };
      onAdd(newQueryData);

      // 수정모드
    } else {
      // 추후 입력된 데이터와 변경된게 없는지 확인하는 로직추가

      const editQueryData = {
        id: queryId,
        name: queryName,
        query: sqlQuery,
        createDt: createDt,
        result: originResult,
      };
      onEdit(editQueryData, id); //id 구분위함
    }
    navigate("/"); //다시 대시보드로
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-lg border bg-white shadow">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header 버튼 */}
          <div className="mb-6 flex items-center justify-between border-b px-4 py-3">
            <h1 className="text-2xl font-bold">쿼리 정보</h1>
            <div className="flex gap-2">
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

          {/* Form부분 */}
          <div className="col-span-2 space-y-5">
            {/* Query ID */}
            <div className="flex items-center gap-3">
              <label htmlFor="query-id" className="w-28 font-medium">
                쿼리 ID
              </label>
              <input
                type="text"
                id="query-id"
                value={queryId}
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

            {/* 조회 결과 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-medium">조회 결과</label>
                <div className="flex items-center gap-3">
                  <span>{lastRun}</span>
                  <span className="text-xl font-semibold text-red-600">
                    {status === true ? "성공" : "실패"}
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

            {/* 조건 */}
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
          <p>생성일자 : {createDt}</p>
          <p>수정일자 : {lastModiDt}</p>
        </form>
      </div>
    </div>
  );
}

export default AddQuery;
