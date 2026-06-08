
"use client";
import React, { useEffect, useRef, useState } from "react";
import { getProjectDetails, } from "@/apiService/client/projects";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Breadcrumb from "../common/Breadcrumb";
import CardBox from "./cardBox";
import { getBatchCategoryCounts } from '@/apiService/client/categories';
import FixedIcons from "./fixedIcons";
import { getProjectCategoryDetails } from "@/apiService/client/projectCategories";
import CustomTooltip from "@/helpers/client/custom_tooltip/tooltip";

export default function ViewProjectDetails({ id }: { id: string }) {
    const [usersList, setUsersList] = useState<any[]>([]);
    const [projectDetail, setProjectDetail] = useState<any>({});
    const [categoryDataMap, setCategoryDataMap] = useState<Record<string, any[]>>({});

    const [scope1, setScope1] = useState<any[]>([]);
    const [scope2, setScope2] = useState<any[]>([]);
    const [scope3, setScope3] = useState<any[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const [porjectId, setPorjectId] = useState('');
    const router = useRouter();
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

    const fetchAllCategoryCounts = async (allCategories: any[]) => {
        if (allCategories.length === 0) return;

        try {
            const categoryIds = allCategories.map(cat => cat.id);
            const result = await getBatchCategoryCounts({
                project_category_ids: categoryIds
            });

            if (result?.status === 200 && result?.data) {
                setCategoryCounts(result.data);
            }
        } catch (error) {
            console.error('Error fetching category counts:', error);
        }
    };

    const fetchCategoryData = async (allCategories: any[]) => {
        const map: Record<string, any[]> = {};
        await Promise.all(
            allCategories.map(async (cat) => {
                const result = await getProjectCategoryDetails({ pid: id, scid: cat.id });
                if (result?.status === 200 && result?.data?.data) {
                    map[cat.id] = result.data.data;
                }
            })
        );
        setCategoryDataMap(map);
    };

    const refreshCounts = () => {
        const allCategories = [...scope1, ...scope2, ...scope3];
        fetchAllCategoryCounts(allCategories);
    };

    const fetchProjectData = async () => {
        try {
            const project_id = id || '';
            if (!project_id) {
                return;
            }
            const result = await getProjectDetails({ project_id: project_id });
            const projectData = result?.data || {};
            setProjectDetail(projectData || {});
            const s1 = projectData?.scope1 || [];
            const s2 = projectData?.scope2 || [];
            const s3 = projectData?.scope3 || [];
            setScope1(s1);
            setScope2(s2);
            setScope3(s3);
            const allCategories = [...s1, ...s2, ...s3];
            await fetchAllCategoryCounts(allCategories);
            await fetchCategoryData(allCategories);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setPorjectId(id);
        fetchProjectData();
    }, [id]);

    return (
        <>

            <FixedIcons
                activeKey="Details"
                items={[
                    { label: "Details", href: `/projects/${porjectId}/view-details`, icon: "fa fa-list" },
                    { label: "Dashboard", href: `/projects/${porjectId}/view-dashboard`, icon: "fa fa-tachometer" },
                ]}
            />
            <Breadcrumb
                items={[
                    { label: "Projects", href: "/projects" },
                    { label: projectDetail.name },
                    { label: "Details" }
                ]}
            />
            <div className="row px-3">
                <div className="col-12 mb-2 bg-white p-3 rounded-3 shadow-lg">
                    <p className="main-title ms-2 d-flex align-items-center">Scope 1
                    <CustomTooltip tooltipKey="scope_1" />

                    </p>
                    <div className="d-flex flex-wrap">
                        {scope1 && scope1?.length > 0 && scope1.map((item) => (
                            <CardBox
                                key={item.id}
                                title={item.name}
                                link={`/projects/${porjectId}/view-details/${item.id}/${item.type}`}
                                icon={item?.icon}
                                projectCategoryId={item.id}
                                assignedUsersCount={categoryCounts[item.id] || 0}
                                onCountUpdate={refreshCounts}
                                tooltipSubject={item.name}
                                categoryData={categoryDataMap[item.id] || []}
                            />
                        ))}
                        {scope1 && scope1?.length === 0 && (
                            <div className="text-center text-gray-500 w-full py-5">
                                No Scope 1 categories found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 mb-2 bg-white p-3 rounded-3 shadow-lg">
                    <p className="main-title ms-2 d-flex align-items-center">Scope 2 <CustomTooltip tooltipKey="scope_2" /></p>
                    <div className="d-flex flex-wrap">
                        {scope2 && scope2?.length > 0 && scope2.map((item) => (
                            <CardBox
                                key={item.id}
                                title={item.name}
                                link={`/projects/${porjectId}/view-details/${item.id}/${item.type}`}
                                icon={item?.icon}
                                projectCategoryId={item.id}
                                assignedUsersCount={categoryCounts[item.id] || 0}
                                onCountUpdate={refreshCounts}
                                tooltipSubject={item.name}
                                categoryData={categoryDataMap[item.id] || []}
                            />
                        ))}
                        {scope2 && scope2?.length === 0 && (
                            <div className="text-center text-gray-500 w-full py-5">
                                No Scope 2 categories found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 mb-2 bg-white p-3 rounded-3 shadow-lg">
                    <p className="main-title ms-2 d-flex align-items-center">Scope 3 <CustomTooltip tooltipKey="scope_3" /></p>
                    <div className="d-flex flex-wrap">
                        {scope3 && scope3?.length > 0 && scope3.map((item) => (
                            <CardBox
                                key={item.id}
                                title={item.name}
                                link={`/projects/${porjectId}/view-details/${item.id}/${item.type}`}
                                icon={item?.icon}
                                projectCategoryId={item.id}
                                assignedUsersCount={categoryCounts[item.id] || 0}
                                onCountUpdate={refreshCounts}
                                tooltipSubject={item.name}
                                categoryData={categoryDataMap[item.id] || []}
                            />
                        ))}
                        {scope3 && scope3?.length === 0 && (
                            <div className="text-center text-gray-500 w-full py-5">
                                No Scope 3 categories found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}