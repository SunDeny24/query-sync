import react from "react";
import {Link} from "react-router-dom";
import CardGrid from "../components/CardGrid.jsx";
import DataList from "../components/DataList.jsx";

function Dashboard({list}) {
    
    return(
        <div>
            <CardGrid list={list} />
            <div className="flex px-3 py-3">
              <h2 className="flex-1 text-xl font-bold mb-4 text-left">검증 결과</h2>
              <Link to="/add">
                <button className="flex-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">쿼리 추가</button>
              </Link>
            </div>
            <DataList list={list} />
        </div>
    )
}

export default Dashboard;
