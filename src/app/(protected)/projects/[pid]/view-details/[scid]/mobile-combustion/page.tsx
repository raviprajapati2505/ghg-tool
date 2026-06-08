import Breadcrumb from "@/components/common/Breadcrumb";
import MobileCombustion from "@/components/projects/categoriesPages/mobileCombustion";


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
                { label: "Mobile Combustion" },
              ]}
            />
          <MobileCombustion pid={pid} scid={scid} />
        </div>
  );
}
