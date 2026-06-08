import Breadcrumb from "@/components/common/Breadcrumb";
import EmployeeCommute from "@/components/projects/categoriesPages/employeeCommute";


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
              { label: "Employee Commute" },
            ]}
          />
         <EmployeeCommute pid={pid} scid={scid} />
       </div>
  );
}
