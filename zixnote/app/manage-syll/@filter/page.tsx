import { getUserAndRole } from "@/utils/getUserAndRole";
import SyllabusFilter from "../component/SyllabusFilter";

export default async function Index() {
  const { role, user } = await getUserAndRole();
  const canModerate = role?.includes("admin");
  return (
    <div className="w-full flex flex-col items-center">
     
      <SyllabusFilter canModerate={canModerate || false} />

      {/* <Demo canModerate={canModerate || false}/> */}
    </div>
  );
}
