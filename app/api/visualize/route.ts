import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if(!session){
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        // search/query params
        const searchParams = req.nextUrl.searchParams;
        const h3Res = parseInt(searchParams.get("swLat") ?? "8");

        // connect to db
        await connectDB();

        // get objectId for aggregation step
        const userObjectId = new Types.ObjectId(session.user.id);

        // get aggregated notes
        const aggregNotes = await Note.aggregate([
            // 1. match to get the current user + filters as needed
            {
                $match: {
                    userId: userObjectId,
                }
            },

            // 2. unwind by categories to count categories per hexagon
            { 
                $unwind: {
                    path: "$categoryIds",
                    preserveNullAndEmptyArrays: true
                } 
            },

            // 3. group by hexagon + category to get those statistics
            {
                $group: {
                    _id: {
                        h3: `$h3.h3_${h3Res}`, // get bin size according to query param
                        categoryId: "$categoryIds" // unwinded: one element coming in
                    },
                    count: { $sum: 1 }, // counts 1 per note
                    earliest: { $min: "$createdAt" },
                    latest: { $max: "$updatedAt" }
                }
            },
            
            // 4. add a isNullCategory field to (later) sort null categories as lowest priority
            {
                $addFields: {
                    isNullCategory: {
                        $cond: [{ $eq: ["$_id.categoryId", null] }, 1, 0]
                        // also: can't use $ifNull here since that works more like ??, not ? :
                    }
                }
            },

            // 5. sort by highest category frequency, with nulls given lowest priority
            { $sort: { isNullCategory: 1, count: -1 } },

            // 6. group into a hexagon's data
            {
                $group: {
                    _id: "$_id.h3", // id by h3, which is unique now since we grouped
                    dominantCategoryId: { $first: "$_id.categoryId" },
                    noteCount: { $sum: "$count" },
                    firstActivity: { $min: "$earliest" },
                    lastActivity: { $max: "$latest" }
                }
            },

            // 7. left join categories
            {
                $lookup: {
                    from: "categories",
                    localField: "dominantCategoryId",
                    foreignField: "_id",
                    as: "domCategory" // intermediate dominant category variable
                }
            },

            // 8. unwind what should be a single dominant category, or null
            { 
                $unwind: {
                    path: "$domCategory",
                    preserveNullAndEmptyArrays: true
                } 
            },

            // 9. add back dominant category field if it's null
            {
                $addFields: {
                    dominantCategory: {
                        $ifNull: ["$domCategory", { name: "<No category>", color: "7f7f7f" }]
                        // here's somewhere where using $ifNull would make sense
                    }
                }
            },

            // 10. project to keep only the needed fields
            {
                $project : {
                    _id: 1,
                    noteCount: 1,
                    firstActivity: 1,
                    lastActivity: 1,
                    "dominantCategory.name": 1,
                    "dominantCategory.color": 1
                }
            }
        ]);

        // return
        return NextResponse.json({ status: "success", resData: aggregNotes }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error getting notes data: ${error}` }, { status: 500 });
    }
}