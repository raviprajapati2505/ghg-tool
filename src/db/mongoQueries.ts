import { getMDBModel } from "@/models/Model";
import { castObjectIds } from "@/helpers/server/function";

/**
 * Save data to a given collection with dynamic shape
 * @param collectionName - Name of the MongoDB collection
 * @param data - JSON data to save
 */
interface TimeSeriesData {
  timestamp?: Date;
  [key: string]: any;
}

type ChildLookup = {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  projection?: Record<string, 0 | 1>;
  where?: Record<string, any>;
};

type JoinConfig = {
  from: string;
  localField: string;
  foreignField?: string;
  as: string;
  type?: "multiple" | "single";
  projection?: Record<string, 0 | 1>;
  sort?: { column: string; order?: 1 | -1 };
  where?: Record<string, any>;
  childLookup?: ChildLookup;
};

type AggregateOptions = {
  collectionName: string;
  where?: any;
  joins?: JoinConfig[];
  projection?: Record<string, 0 | 1>;
  sort?: {
    column: string;
    order?: 1 | -1;
  };
};

export const saveMDBData = async (collectionName: string, data: TimeSeriesData = {}) => {
  const Model = await getMDBModel(collectionName);
  if (
    ["file_contents"].includes(collectionName) &&
    !data.timestamp
  ) {
    data.timestamp = new Date();
  }
  castObjectIds(data);
  const doc = new Model(data);
  return await doc.save();
};

export const updateMDBData = async (collectionName: string, filter: any = {}, data = {}, many = false) => {
  const Model = await getMDBModel(collectionName);
  castObjectIds(filter);
  castObjectIds(data);
  if (many) {
    return await Model.updateMany(filter, { $set: data });
  } else {
    return await Model.updateOne(filter, { $set: data });
  }
};

export const getMDBData = async (collectionName: string, filter: any = {}, projection: any = null, sort: any = null) => {
  const Model = await getMDBModel(collectionName);
  castObjectIds(filter);

  let query = Model.find(filter, projection).lean();
  if (sort) {
    query = query.sort(sort);
  }
  return await query.exec();
};

export const getMDBSingleData = async (collectionName: string, filter: any = {}, projection: any = null) => {
  const Model = await getMDBModel(collectionName);
  castObjectIds(filter);
  if (projection) {
    return await Model.findOne(filter, projection);
  }
  return await Model.findOne(filter);
};

export const deleteMDBData = async (collectionName: string, filter: any = {}, many: boolean = false) => {
  const Model = await getMDBModel(collectionName);
  castObjectIds(filter);
  if (many) {
    return await Model.deleteMany(filter);
  } else {
    return await Model.deleteOne(filter);
  }
};

export const insertManyMDBData = async (collectionName: string, data: any[]) => {
  const Model = await getMDBModel(collectionName);
  if (data.length === 0) return [];
  data.forEach(item => {
    castObjectIds(item);
  });
  return await Model.insertMany(data);
}

export async function aggregateWithJoins({
  collectionName,
  where = {},
  joins = [],
  projection = {},
  sort,
}: AggregateOptions) {
  const Model = await getMDBModel(collectionName);
  const pipeline: any[] = [];

  castObjectIds(where);

  if (Object.keys(where).length) {
    pipeline.push({ $match: where });
  }

  for (const join of joins) {
    const lookup: any = {
      $lookup: {
        from: join.from,
        let: { localId: `$${join.localField}` },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [`$${join.foreignField ?? "_id"}`, "$$localId"],
              },
            },
          },
          ...(join.where ? [{ $match: castObjectIds(join.where) }] : []),
        ],
        as: join.as,
      },
    };

    if (join.sort) {
      lookup.$lookup.pipeline.unshift({
        $sort: { [join.sort.column]: join.sort.order ?? -1 },
      });
    }

    if (join.projection) {
      lookup.$lookup.pipeline.push({ $project: join.projection });
    }

    if (join.childLookup) {
      const child = join.childLookup;
      lookup.$lookup.pipeline.push({
        $lookup: {
          from: child.from,
          localField: child.localField,
          foreignField: child.foreignField,
          as: child.as,
          pipeline: [
            ...(child.where ? [{ $match: castObjectIds(child.where) }] : []),
            ...(child.projection ? [{ $project: child.projection }] : []),
          ],
        },
      });
    }

    pipeline.push(lookup);

    if (join.type !== "multiple") {
      pipeline.push({
        $unwind: {
          path: `$${join.as}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }
  }

  if (sort?.column) {
    pipeline.push({
      $sort: { [sort.column]: sort.order ?? -1 },
    });
  }

  if (Object.keys(projection).length) {
    pipeline.push({ $project: projection });
  }

  const data = await Model.aggregate(pipeline).exec();

  return data.map((doc, index) => ({
    ...doc,
    _id_str: doc._id.toString(),
    row_no: index + 1,
  }));
}
