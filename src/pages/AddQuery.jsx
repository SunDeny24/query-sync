import React from "react";

function AddQuery() {
    return (
        <div>
            <form className="grid grid-cols-2 border">
                <h1 className="col-span-2 text-2xl font-bold py-3 text-left">쿼리정보</h1>
                <div className="">
                    <label htmlFor="queryId" className="px-3">쿼리 ID</label>
                    <input type="text" id="queryId" className="p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded"/>
                </div>
                <div className="">
                    <label htmlFor="queryNm" className="px-3">쿼리 이름</label>
                    <input type="text" id="queryNm" className="p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded"/>
                </div>
                <div className="col-span-2">
                    <label htmlFor="sqlQuery" className="px-3 py-5 block text-left">SQL 쿼리</label>
                    <textarea type="textarea" id="sqlQuery" className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded"/>
                </div>
            </form>
        </div>
    )
}

export default AddQuery;