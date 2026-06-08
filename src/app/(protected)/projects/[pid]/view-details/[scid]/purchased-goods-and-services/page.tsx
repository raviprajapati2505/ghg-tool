import Breadcrumb from "@/components/common/Breadcrumb";
import PurchasedGoodsAndServices from "@/components/projects/categoriesPages/purchasedGoodsAndServices";


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
                { label: "Purchased Goods and Services" },
              ]}
            />
          <PurchasedGoodsAndServices pid={pid} scid={scid} />
        </div>
  );
}
