import Breadcrumb from "@/components/common/Breadcrumb";
import FireExtinguishers from "@/components/projects/categoriesPages/fireExtinguishers";


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
                { label: "Fire Extinguishers" },
              ]}
            />
          <FireExtinguishers pid={pid} scid={scid} />
        </div>
  );
}
