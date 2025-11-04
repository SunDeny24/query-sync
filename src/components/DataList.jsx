import react from "react";
import { Link } from "react-router-dom";

function DataList({ list }) {
  return (
    <>
      <div className="rounded-2xl bg-white shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-2">쿼리ID</th>
              <th className="p-2">쿼리이름</th>
              <th className="p-2">실행시간</th>
              <th className="p-2">결과</th>
              <th className="p-2">상세보기</th>
            </tr>
          </thead>
          <tbody>
            {list &&
              list.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.result?.lastRun || "-"}</td>
                  <td>
                    {item.result?.status === true
                      ? "성공"
                      : item.result?.status === false
                        ? "실패"
                        : ""}
                  </td>
                  <td>
                    <button className="rounded-lg bg-amber-200 px-3 py-1 text-black transition-colors hover:bg-amber-400">
                      <Link to={`/add/${item.id}`}>보기</Link>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default DataList;
