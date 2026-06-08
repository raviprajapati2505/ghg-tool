import Breadcrumb from "@/components/common/Breadcrumb";
import FuelEnergyRelated from "@/components/projects/categoriesPages/fuelEnergyRelated";


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
                { label: "Fuel & Energy Related" },
              ]}
            />
          <FuelEnergyRelated pid={pid} scid={scid} />
        </div>
  );
}
