import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/helpers/server/authGuard";
import { getMDBModel } from "@/models/Model";
import { ObjectId } from "mongodb";

export const POST = async (request: NextRequest) => {
    try {
        const authUser = await authGuard(request);
        if (authUser instanceof Response) return authUser;

        const { project_category_ids } = await request.json();

        if (!project_category_ids || !Array.isArray(project_category_ids)) {
            return NextResponse.json({ 
                status: 400, 
                message: "Invalid request", 
                data: {} 
            });
        }
        const objectIds = project_category_ids.map(id => new ObjectId(id));

        const Model = await getMDBModel("project_category_users");
        
        const counts = await Model.aggregate([
            {
                $match: {
                    project_category_id: { $in: objectIds },  
                    $or: [
                        { is_deleted: { $ne: true } },
                        { is_deleted: { $exists: false } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$project_category_id",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result: Record<string, number> = {};
        
        project_category_ids.forEach((id: string) => {
            result[id] = 0;
        });
        
        counts.forEach((item: any) => {
            result[item._id.toString()] = item.count;
        });

        return NextResponse.json({ 
            status: 200, 
            message: "Counts fetched successfully",
            data: result 
        });

    } catch (error: any) {
        console.error('Batch counts error:', error);
        return NextResponse.json({ 
            status: 500, 
            message: "Error fetching counts",
            data: {} 
        });
    }
};