import { useEffect, useState } from "react";
import type { Question } from "./types";

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

export default function surveyList() {
    
  const [surData, setSurData] = useState<any[]>([]);
  useEffect(()=>{
    async function fetchUsers() {
      const res:any = await fetch('http://127.0.0.1:8000/api/surveys/');
      const data:any = await res.json();
      setSurData(data);
    }
    fetchUsers();
  },[])

  console.log(surData)
  return surData
}
