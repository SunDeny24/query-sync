// 더미 데이터 (API 연동 전사용)
export const fakeQueryData = [
  {
    id: "Q001",
    name: "판매전환 중복건검증",
    query:
      "SELECT sale_id, COUNT(*) FROM sales GROUP BY sale_id HAVING COUNT(*) > 1;",
    lastRun: "2025-08-27 10:36:35",
    status: true,
  },
  {
    id: "Q002",
    name: "원영수증 누락건",
    query: "SELECT * FROM receipts WHERE original_receipt_id IS NULL;",
    lastRun: "2025-08-27 10:36:35",
    status: true,
  },
  {
    id: "Q003",
    name: "판매전환의 예약취소건",
    query:
      "SELECT * FROM sales WHERE status = 'CANCELLED' AND type = 'RESERVATION';", // 쿼리문 추가
    lastRun: "2025-08-27 10:36:35",
    status: false,
  },
];
