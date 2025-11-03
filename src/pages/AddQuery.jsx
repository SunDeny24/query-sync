import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AddQuery({ onAdd, onEdit }) {
  /*------------- State 관리데이터(저장될데이터)--------- */
  const [queryId, setQueryId] = useState(""); /* 쿼리ID */
  const [queryName, setQueryName] = useState(""); /* 쿼리이름 */
  const [sqlQuery, setSqlQuery] = useState(""); /* SQL 쿼리 */
  const [createDt, setcreateDt] = useState(""); /* 생성일자 */
  const [modiDt, setModiDt] = useState(""); /* 수정일자 */

  //조회결과 섹션
  const [originResult, setOriginResult] = useState(null); /* 기존결과 */
  const [lastRun, setLastRun] = useState(""); /* 마지막실행일자 */
  const [status, setStatus] = useState(""); /* 성공여부 */
  const [resultData, setResultData] = useState([]); /* 결과배열 */
  const [error, setError] = useState(""); /* 에러 */

  //조건 섹션
  const [condType, setCondType] = useState(null); /* 선택된 조건 */
  const [cond1Oper, setCond1Oper] = useState("="); /* 조건1 - 연산자 */
  const [cond1Val, setCond1Val] = useState(0); /* 조건1 - 행 갯수 */
  const [cond2Col, setCond2Col] = useState(""); /* 조건2 - 컬럼 */
  const [cond2Val, setCond2Val] = useState("true"); /* 조건2 - 참,거짓값 */
  const [cond3Time, setCond3Time] = useState(1000); /* 조건3 - 실행시간 */

  const [orginData, setOriginData] = useState(null); /* 원본데이터 */

  /* -------------------------------------------------- */

  const navigate = useNavigate();
  const { id } = useParams(); //수정(보기)모드에 필요한 id 파라미터
  const isEditMode = Boolean(id); //입력, 수정모드
  const CONDITION_LABLES = {
    cond1: "조건 1",
    cond2: "조건 2",
    cond3: "조건 3",
  };

  //수정(보기)모드일때 데이터조회
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
        setOriginData(results); /* 원본데이터 */
        setQueryId(results.id);
        setQueryName(results.name);
        setSqlQuery(results.query);
        setcreateDt(results.createDt);
        setModiDt(results.modiDt);

        //result 데이터
        setOriginResult(results.result);
        if (results.result) {
          setLastRun(results.result.lastRun || "");
          setStatus(results.result.status);
          setResultData(results.result.resultData || []);
        }
        //조건 데이터
        if (results.condition) {
          setCondType(results.condition.type);
          switch (results.condition.type) {
            case "cond1":
              setCond1Oper(results.condition.operator || "=");
              setCond1Val(results.condition.value || 0);
              break;
            case "cond2":
              setCond2Col(results.condition.column || "");
              setCond2Val(results.condition.value || "true");
              break;
            case "cond3":
              setCond3Time(results.condition.time || 1000);
              break;
            default:
              setCondType(null);
          }
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

  /* 변경감지 함수 */
  const isDirty = () => {
    if (!isEditMode || !orginData) {
      // 신규거나 원본없으면 변경되지않은 상태
      return false;
    }

    let dirtyArr = [];
    if (orginData.name.trim() != queryName.trim()) {
      dirtyArr.push("쿼리이름");
    }
    if (orginData.query.trim() != sqlQuery.trim()) {
      dirtyArr.push("SQL 쿼리");
    }

    const orginCondType = orginData.condition?.type || null; //condType undefined 체크 변수
    if (orginCondType != condType) {
      dirtyArr.push("조건타입");
    } else {
      if (condType === "cond1") {
        if (orginData.condition.operator !== cond1Oper)
          dirtyArr.push("조건1-연산자");
        if (Number(orginData.condition.value) !== Number(cond1Val))
          dirtyArr.push("조건1-값");
      } else if (condType === "cond2") {
        if ((orginData.condition.column || "").trim() !== cond2Col.trim())
          dirtyArr.push("조건2-컬럼명");
        if (orginData.condition.value !== cond2Val) dirtyArr.push("조건2-값");
      } else if (condType === "cond3") {
        if (Number(orginData.condition.time) !== Number(cond3Time))
          dirtyArr.push("조건3-시간");
      }
    }

    return dirtyArr;
  };
  /* form 저장 이벤트 */
  const handleSubmit = (e) => {
    e.preventDefault();

    //조건섹션 초기화
    let conditionData = null;
    if (condType) {
      conditionData = { type: condType };
      switch (condType) {
        case "cond1":
          conditionData.operator = cond1Oper;
          conditionData.value = cond1Val;
          break;
        case "cond2":
          conditionData.column = cond2Col;
          conditionData.value = cond2Val;
          break;
        case "cond3":
          conditionData.time = cond3Time;
          break;
        default:
          conditionData = null;
      }
    }
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
          lastRun: null,
          status: null,
          resultData: [],
          error: null,
        },
        condition: conditionData,
      };
      onAdd(newQueryData);

      // 수정모드
    } else {
      if (!isDirty()) {
        alert("변경된 내용이 없습니다.");
        return;
      }
      const editQueryData = {
        id: queryId,
        name: queryName,
        query: sqlQuery,
        createDt: createDt,
        result: originResult,
        condition: conditionData,
      };
      onEdit(editQueryData, id); //id 구분위함
    }
    navigate("/"); //다시 대시보드로
  };

  /* 쿼리 실행시 이벤트 */
  const runQuery = (e) => {
    const changedData = isDirty();
    if (changedData.length > 0) {
      alert(
        `변경된 내용이 있습니다. => ${changedData.join(",")} \n\n 먼저 '저장'버튼을 눌러주세요!`,
      );
      return;
    }
    const runResultData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/queryMaster/${id}`);
        if (!res.ok) {
          throw new Error("데이터 불러오는데 실패했습니다.");
        }
        const results = await res.json();
        if (results.result) {
          setLastRun(results.result.lastRun || "N/A");
          setStatus(results.result.status);
          setResultData(results.result.resultData || []);
          setOriginResult(results.result);
        } else {
          setLastRun("N/A");
          setStatus(false);
          setResultData([]);
        }
      } catch (error) {
        console.log("쿼리실행중 에러 :", error);
        setStatus(false); // 에러시 실패로
        setResultData([]);
      }
    };
    runResultData();
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-lg border bg-white shadow">
        <form onSubmit={handleSubmit} className="p-6">
          {/* --- Header 버튼 --- */}
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

          {/* ------ Form부분 ------ */}
          <div className="col-span-2 space-y-5">
            {/* 쿼리 ID */}
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

            {/* --- 쿼리 이름 --- */}
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

            {/* --- SQL Query --- */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="sql-query" className="font-medium">
                  SQL 쿼리
                </label>
                <button
                  onClick={runQuery}
                  type="button"
                  disabled={!isEditMode}
                  className={`rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700 ${!isEditMode ? "cursor-not-allowed bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
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
            {/* --- 조건 섹션 --- */}
            <div className="col-span-2 space-y-5">
              <label
                htmlFor="condition"
                className="mb-2 flex items-center font-medium"
              >
                조건 : {CONDITION_LABLES[condType] || "조건 없음"}
              </label>

              <div className="space-y-3 border border-gray-200 bg-gray-50 p-4">
                {/* 조건 1 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="cond1"
                    checked={condType === "cond1"}
                    onChange={(e) => setCondType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    조건 1: 조회된 행의 갯수 검증 (어떤 행의 갯수가 0보다 크면 t
                    or f)
                  </span>
                </label>
                {/* 조건 1 상세사항 */}
                {condType === "cond1" && (
                  <div className="ml-6 rounded-md border border-gray-300 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={cond1Oper}
                        onChange={(e) => setCond1Oper(e.target.value)}
                        className="rounded border border-gray-300 p-1 text-sm"
                      >
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                      </select>
                      <input
                        type="number"
                        value={cond1Val}
                        onChange={(e) =>
                          setCond1Val(parseInt(e.target.value) || 0)
                        }
                        className="w-24 rounded border border-gray-300 p-1 text-sm"
                      />
                      <span className="text-sm text-gray-600">개</span>
                    </div>
                  </div>
                )}

                {/* 조건 2 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="cond2"
                    checked={condType === "cond2"}
                    onChange={(e) => setCondType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    조건 2: 조회된 컬럼의 참, 거짓 검증 (컬럼 값이 t or f에 따라
                    맞으면 t or f )
                  </span>
                </label>

                {/* 조건 2 상세사항 */}
                {condType === "cond2" && (
                  <div className="ml-6 space-y-2 rounded-md border border-gray-300 bg-white p-3">
                    <div>
                      <label className="text-sm font-medium">컬럼명:</label>
                      <input
                        type="text"
                        placeholder="ex) is_duplicated"
                        value={cond2Col}
                        onChange={(e) => setCond2Col(e.target.value)}
                        className="mt-1 w-full rounded border border-gray-300 p-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">기대값:</label>
                      <select
                        value={cond2Val}
                        onChange={(e) => setCond2Val(e.target.value)}
                        className="mt-1 w-full rounded border border-gray-300 p-1 text-sm"
                      >
                        <option value="true">참 (True)</option>
                        <option value="false">거짓 (False)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 조건 3 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="cond3"
                    checked={condType === "cond3"}
                    onChange={(e) => setCondType(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    조건 3: SQL 실행 시간 검증 (ms) (실행시간이 10000이면 f or
                    t)
                  </span>
                </label>

                {/* 조건 3 상세사항 */}
                {condType === "cond3" && (
                  <div className="ml-6 rounded-md border border-gray-300 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">
                        최대 실행 시간:
                      </label>
                      <input
                        type="number"
                        placeholder="ex) 1000"
                        value={cond3Time}
                        onChange={(e) =>
                          setCond3Time(parseInt(e.target.value) || 0)
                        }
                        className="w-24 rounded border border-gray-300 p-1 text-sm"
                      />
                      <span className="text-sm text-gray-600">ms 이하</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- 조회 결과 --- */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="font-medium">조회 결과</label>
                <div className="flex items-center gap-3">
                  <span>{lastRun}</span>
                  <span
                    className={`text-xl font-semibold ${status ? "text-green-600" : "text-red-600"}`}
                  >
                    {status === true ? "성공" : status === false ? "실패" : ""}
                  </span>
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  {resultData.length > 0 && (
                    <tr className="bg-gray-100 text-center">
                      {Object.keys(resultData[0]).map((head) => (
                        <th key={head} className="p-2">
                          {head}
                        </th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {resultData.length > 0 ? (
                    resultData.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {Object.values(row).map((val, idx) => (
                          <td key={idx}>{val}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    // 데이터가 없을 경우
                    <tr>
                      <td
                        colSpan={100}
                        className="p-4 text-center text-gray-500"
                      >
                        조회된 데이터가 없습니다.{" "}
                        {isEditMode ? "'쿼리 실행' 버튼을 클릭하세요." : ""}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {isEditMode && (
            <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-sm text-gray-600">
              <span>
                <strong>생성일자 :</strong> {createDt || "N/A"}
              </span>
              <span>
                <strong>수정일자 :</strong> {modiDt || "N/A"}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddQuery;
