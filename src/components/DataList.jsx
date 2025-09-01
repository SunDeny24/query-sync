import react from "react";

function DataList({list}) {
    return(
    <>
        <div className="bg-white rounded-2xl shadow">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-center">
                        <th className="p-2">쿼리ID</th>
                        <th className="p-2">쿼리이름</th>
                        <th className="p-2">실행시간</th>
                        <th className="p-2">결과</th>
                    </tr>
                </thead>
                <tbody>
                   {list.map((list)=>(
                    <tr key={list.id}>
                        <td>{list.id}</td>
                        <td>{list.name}</td>
                        <td>{list.lastRun}</td>
                        <td>{list.status===true?"성공":"실패"}</td>
                    </tr>
                   ))
                   } 
                </tbody>
            </table>
        </div>
    </>
    )
}

export default DataList;
