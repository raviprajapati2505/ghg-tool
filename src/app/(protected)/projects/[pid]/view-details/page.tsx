import ViewProjectDetails from "@/components/projects/viewProjectDetails";


export default async function Page({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const { pid } = await params;

  return (
    <div>
      <ViewProjectDetails id={pid} />
    </div>
  );
}
