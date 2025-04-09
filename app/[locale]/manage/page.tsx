import UserTable from "@/components/ui-admin/UserTable";

export default function DashBoardPage() {
  return (
    <div className="flex flex-col justify-center items-center h-full py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <UserTable />
    </div>
  );
}
