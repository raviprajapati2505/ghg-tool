import Breadcrumb from "@/components/common/Breadcrumb";
import BusinessTravel from "@/components/projects/categoriesPages/businessTravel";


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
          { label: "Business Travel" },
        ]}
      />
      <BusinessTravel pid={pid} scid={scid} />
    </div>
  );
}
