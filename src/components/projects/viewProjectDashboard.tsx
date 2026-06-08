
"use client";
import React, { useEffect, useRef, useState } from "react";
import { getProjectDetails, getProjectResult, } from "@/apiService/client/projects";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Breadcrumb from "../common/Breadcrumb";
import { getBatchCategoryCounts } from '@/apiService/client/categories';
import FixedIcons from "./fixedIcons";
import TotalEmissionCard from "./dashboardTopCard/totalEmissionCard";
import EmissionByScopeCard from "./dashboardTopCard/emissionByScopeCard";
import TopFiveContributorsCard from "./dashboardTopCard/topFiveContributorsCard";
import DonutChartbyCategoryCard from "./dashboardTopCard/donutChartbyCategoryCard";
import ScopeCategoriesChartCard from "./dashboardTopCard/scopeCategoriesChartCard";

export default function ViewProjectDashboard({ id }: { id: string }) {
    const [usersList, setUsersList] = useState<any[]>([]);

    const [scope1, setScope1] = useState<any[]>([]);
    const [scope2, setScope2] = useState<any[]>([]);
    const [scope3, setScope3] = useState<any[]>([]);

    const [projectResultInfo, setProjectResultInfo] = useState<any>({});

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
            const result = await getProjectResult({ id: project_id });
            const projectData = result?.data || {};
            const s1 = projectData?.scope1 || [];
            const s2 = projectData?.scope2 || [];
            const s3 = projectData?.scope3 || [];
            const projectResultInfo = projectData?.ProjectResultInfo || {};
            setProjectResultInfo(projectResultInfo);
            setScope1(s1);
            setScope2(s2);
            setScope3(s3);
            
            const allCategories = [...s1, ...s2, ...s3];
            await fetchAllCategoryCounts(allCategories);

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
                activeKey="Dashboard"
                items={[
                    { label: "Details", href: `/projects/${porjectId}/view-details`, icon: "fa fa-list" },
                    { label: "Dashboard", href: `/projects/${porjectId}/view-dashboard`, icon: "fa fa-tachometer" },
                ]}
            />
            <Breadcrumb
                items={[
                    { label: "Projects", href: "/projects" },
                    { label: "Dashboard" }
                ]}
            />
            <div className="row px-3">
                <div className="col-12 mb-2 bg-white p-3 rounded-3 shadow-sm">
                    <div className="row">
                        <div className="col-3 p-2">
                            <TotalEmissionCard value={projectResultInfo?.totalProjectEmissionsmTCO2e || 0} />
                        </div>
                        <div className="col-3 p-2 h-100">
                            <EmissionByScopeCard
                                scope1={projectResultInfo?.scope1TotalEmissionsmTCO2e || 0}
                                scope2={projectResultInfo?.scope2TotalEmissionsmTCO2e || 0}
                                scope3={projectResultInfo?.scope3TotalEmissionsmTCO2e || 0}
                            />
                        </div>
                        <div className="col-3 p-2">
                            <TopFiveContributorsCard categoriesResult={projectResultInfo?.allCategoriesResult} />
                        </div>
                        <div className="col-3 p-2">
                            <DonutChartbyCategoryCard categoriesResult={projectResultInfo?.allCategoriesResult} />
                        </div>
                    </div>
                </div>

                <div className="col-12 mb-2 p-0">
                    <div className="row">
                        <div className="col-4 p-2">
                            <ScopeCategoriesChartCard categoryResult={scope1} title="Scope 1 Categories" />
                        </div>
                        <div className="col-4 p-2">
                            <ScopeCategoriesChartCard categoryResult={scope2} title="Scope 2 Categories" />
                        </div>
                        <div className="col-4 p-2">
                            <ScopeCategoriesChartCard categoryResult={scope3} title="Scope 3 Categories" />
                        </div>
                    </div>
                </div>





            </div>
        </>
    );
}