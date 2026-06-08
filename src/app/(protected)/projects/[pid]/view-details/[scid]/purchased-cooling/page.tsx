import Breadcrumb from "@/components/common/Breadcrumb";
import PurchasedCooling from "@/components/projects/categoriesPages/purchasedCooling";


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
                { label: "Purchased Cooling" },
              ]}
            />
          <PurchasedCooling pid={pid} scid={scid} />
        </div>
  );
}
