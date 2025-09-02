import react from "react";

function CardGrid({list}) {

    // 쿼리리스트 카운팅 변수 선언
    const count = list.length;
    const success = list.filter((v)=>v.status===true).length;
    const fail = list.filter((v)=>v.status===false).length;
    const unknown = count-success-fail; //알수없는 결과값

    return(
    <>
        <h1 className="text-2xl font-bold mb-4">검증현황 대시보드</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow text-center">
                <span className="block text-sm text-gray-500">전체</span>
                <span className="block text-2xl font-bold text-gray-800">{count}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow text-center">                
                <span className="block text-sm text-gray-500">성공</span>
                <span className="block text-2xl font-bold text-gray-800">{success}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow text-center">                     
                <span className="block text-sm text-gray-500">실패</span>
                <span className="block text-2xl font-bold text-gray-800">{fail}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow text-center">                     
                <span className="block text-sm text-gray-500">알수없음</span>
                <span className="block text-2xl font-bold text-gray-800">{unknown}</span>
            </div>
        </div>
    </>
    )
}

export default CardGrid;
