import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getRolePermission } from "@/utils/roleAndPermission";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryAssignUsersModal from "../projectCategories/categoryAssignUserModal";
import StatusGaugeMeter from "../common/Statusmeter";
import CustomTooltip from "@/helpers/client/custom_tooltip/tooltip";


function CardBox({
    title,
    link,
    icon,
    projectCategoryId,
    assignedUsersCount = 0,
    onCountUpdate,
    tooltipSubject,
    categoryData,
}: {
    title: any;
    link: any;
    icon?: any;
    projectCategoryId: string;
    assignedUsersCount?: number;
    onCountUpdate?: () => void;
    tooltipSubject?: string;
    categoryData?: { review_status?: string }[];
}) {
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const authUser = useSelector((state: RootState) => state.auth);
    const authRoleId = authUser?.role_id;
    const canAssignUsers = getRolePermission(authRoleId, "add-user");
    const router = useRouter();

    const handleCardClick = () => {
        router.push(link);
    };
   const convertToKebabCase = (str?: string) => {
    if (!str) return '';

    return str
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .trim()
        .replace(/\s+/g, '_');
};

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 p-2 scope-category-box">
            <div className="pb-3 w-full scope-category-box-sub-div position-relative">
                {tooltipSubject && (
                    <div
                        style={{ position: 'absolute', top: 6, right: 8, zIndex: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        <CustomTooltip tooltipKey={convertToKebabCase(tooltipSubject)} />
                    </div>
                )}
                <div className="card-title mb-2 font-bold d-flex align-items-center justify-content-center flex-column mt-2 p-3 scope-category-body-div"
                    onClick={() => { handleCardClick(); }}>
                    {icon && (
                        <span className="scope-category-icon">
                            <i className={`fas ${icon}`}></i>
                        </span>
                    )}
                    <span className="ms-2 scope-category-title">
                        {title}
                    </span>
                </div>
                <div
                    className="d-flex align-items-center justify-content-center gap-2"
                    style={{ padding: '4px 8px 6px 8px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {categoryData && <StatusGaugeMeter data={categoryData} />}
                    {canAssignUsers && (
                        <div
                            className="position-relative"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsAssignModalOpen(true)}
                            title="Manage Users"
                        >
                            <i className="fas fa-user" style={{ fontSize: '1.2rem', color: '#681949' }}></i>
                            {assignedUsersCount > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                                    style={{ fontSize: '0.65rem', padding: '0.25em 0.5em' }}
                                >
                                    {assignedUsersCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <CategoryAssignUsersModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    if (onCountUpdate) {
                        onCountUpdate();
                    }
                }}
                projectCategoryId={projectCategoryId}
                categoryName={title}
            />
        </div>
    );
}

export default CardBox;