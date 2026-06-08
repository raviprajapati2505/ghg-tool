import Breadcrumb from "@/components/common/Breadcrumb";
import ElectricityConsumption from "@/components/projects/categoriesPages/electricityConsumption";


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
                { label: "Electricity Consumption" },
              ]}
            />
          <ElectricityConsumption pid={pid} scid={scid} />
        </div>
  );
}
