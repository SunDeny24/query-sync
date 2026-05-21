import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
import AddQuery from "./pages/AddQuery.jsx";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

function App() {
  const queryClient = useQueryClient(); // React Query의 클라이언트 인스턴스. 쿼리 무효화 등에 사용.

  // 오늘 날짜를 DB에 저장할 포맷으로 만들어주기 (YYYY-MM-DD HH:MM:SS 형태).
  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  /**
   * 1. 쿼리리스트 데이터 조회 (useQuery,select)
   */
  const {
    data: queryList = [], // 쿼리 리스트(결과 + 이름 병합) — 기본값 빈 배열
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["queryList"], // React Query의 캐시 키
    queryFn: async () => {
      // queryMaster 단일 테이블에서 id 순서대로 가져오기
      const { data, error } = await supabase
        .from("queryMaster")
        .select("*")
        .order("id", { asceding: true });

      // Supabase 요청 에러 처리
      if (error) throw error;

      return data;
    },
  });

  /**
   * 1. 쿼리ID 생성함수
   *  - 기존 리스트에서 ID를 추출하여 가장 큰 번호를 찾고, 그 번호에 1을 더한 새로운 ID를 생성합니다.
   *  - list: 기존 쿼리 리스트 (queryList)
   *  - 형식: "Q" + 4자리 숫자 (예: Q0001)
   * */
  const generateNewId = (list) => {
    if (list.length === 0) {
      console.log("데이터없으면 초기화: Q0001");
      return "Q0001";
    }
    //정수추출
    const num = list.map((item) => parseInt(item.id.replace("Q", ""), 10));
    //최대값 가져오기
    const maxNum = Math.max(...num);
    //새로운 번호 생성
    const newNum = maxNum + 1;
    //번호포맷생성
    return "Q" + String(newNum).padStart(4, "0");
  };

  /**
   * 2. 데이터 추가 (useMutation, insert)
   * */
  const addMutation = useMutation({
    mutationFn: async (newQueryData) => {
      // 현재 캐시된 queryList를 사용해 새로운 id 생성
      const newId = generateNewId(queryList);

      const addData = {
        id: newId,
        createDt: today,
        modiDt: null,
        ...newQueryData, // condition 데이터 포함
      };
      const { error } = await supabase.from("queryMaster").insert([addData]);

      if (error) throw error;

      return true;
    },
    // 새로 추가했으므로 queryList를 무효화해서 최신 데이터를 다시 불러오게 함
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queryList"] });
    },
    onError: (error) => console.log("쿼리 저장시 에러: ", error),
  });
  /** 저장 호출 함수 */
  const saveAddQuery = (newQueryData) => {
    addMutation.mutate(newQueryData);
  };

  /**
   * 3. 상세보기 시 데이터 수정 (Update)
   * - 이름, 쿼리문 등은 queryDefinitions 테이블에 있으므로 해당 테이블을 업데이트합니다.
   * */
  const editMutation = useMutation({
    mutationFn: async ({ id, editQueryData }) => {
      const editData = {
        modiDt: today,
        ...editQueryData,
      };
      const { error } = await supabase
        .from("queryMaster")
        .update(editData)
        .eq("id", id); // 수정할 대상 ID 지정

      if (error) throw error;
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["queryList"] }),
    onError: (error) => console.log("쿼리 수정시 에러: ", error),
  });

  /** 수정 호출 함수 */
  const editAddQuery = (editQueryData, id) => {
    editMutation.mutate({ id, editQueryData });
  };

  /**
   * 4. 삭제 (useMutation, delete)
   * */
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("queryMaster")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queryList"] });
    },
    onError: (error) => console.log("삭제시 에러 : ", error.message),
  });

  const deleteQuery = (id) => {
    deleteMutation.mutate(id);
  };

  /**
   * 5. 실행결과 반영 (useMutation, update)
   */
  const updateResultMutation = useMutation({
    mutationFn: async ({ id, newResult }) => {
      // 실행 결과를 DB에도 저장해서 새로고침해도 안 날아가게 처리
      const { error } = await supabase
        .from("queryMaster")
        .update({ result: newResult })
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queryList"] });
    },
    onError: (error) => console.log("결과 반영시 에러 : ", error.message),
  });

  const updateQueryList = (id, newResult) => {
    updateResultMutation.mutate({ id, newResult });
  };
  // 로딩 및 에러 화면
  if (isLoading) return <div>데이터를 불러오는 중입니다...</div>;
  if (isError) return <div>데이터를 불러오는데 실패했습니다.</div>;

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard list={queryList} />} />
        <Route path="/add" element={<AddQuery onAdd={saveAddQuery} />} />
        <Route
          path="/add/:id"
          element={
            <AddQuery
              onEdit={editAddQuery}
              onDelete={deleteQuery}
              onRunQuery={updateQueryList}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
