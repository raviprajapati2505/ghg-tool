
import ViewProjectDashboard from "@/components/projects/viewProjectDashboard";

export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const { pid } = await params;

  return (
    <div>
      <ViewProjectDashboard id={pid} />
    </div>
  );
}
