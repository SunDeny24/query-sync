import react from "react";
import CardGrid from "../components/CardGrid.jsx";
import DataList from "../components/DataList.jsx";

function Dashboard() {
    
  // 더미 데이터 (API 연동 전)
  const fakeQueryData = [
  {
    id: "Q001",
    name: "판매전환 중복건검증",
    lastRun: "2025-08-27 10:36:35",
    status: true,
  },
  {
    id: "Q002",
    name: "원영수증 누락건",
    lastRun: "2025-08-27 10:36:35",
    status: true,
  },
  {
    id: "Q003",
    name: "판매전환의 예약취소건",
    lastRun: "2025-08-27 10:36:35",
    status: false,
  },
  {
    id: "Q004",
    name: "판매전환오류건",
    lastRun: "2025-08-27 10:36:35",
    status: true,
  },
];

    return(
        <div>
            <CardGrid list={fakeQueryData} />
            <DataList list={fakeQueryData} />
        </div>
    )
}

export default Dashboard;
