import Breadcrumb from "@/components/common/Breadcrumb";
import WasteGenerated from "@/components/projects/categoriesPages/wasteGenerated";


export default async function Page({
  params,
}: {
  params: Promise<{ pid: string; scid: string }>;
}) {
  const { pid, scid } = await params;
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Projects", href: "/projects/" },
          { label: "Details", href: `/projects/${pid}/view-details` },
          { label: "Waste Generated" },
        ]}
      />
      <WasteGenerated pid={pid} scid={scid} />
    </div>
  );
}
