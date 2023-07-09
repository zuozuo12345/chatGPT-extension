import { normalize, denormalize, schema } from "normalizr";
import Fuse from "fuse.js";

type SchemaFunction = (value: any, parent: any, key: string) => string;

export function normaliseData(
  data: Array<any>,
  idAttribute?: string | SchemaFunction
) {
  try {
    if (data.length > 0) {
      const idAttributeOption = idAttribute === undefined ? "id" : idAttribute;

      const schema_ = new schema.Entity("normalisedData", undefined, {
        idAttribute: idAttributeOption,
      });
      const schemaList = [schema_];

      const { entities } = normalize(data, schemaList);

      return entities.normalisedData;
    } else {
      throw "No data";
    }
  } catch (error) {
    return {};
  }
}

export function denormaliseData(data: Array<any>) {
  try {
    if (Object.keys(data).length > 0) {
      const schema_ = new schema.Entity("normalisedData");
      const mySchema = { normalisedData: [schema_] };
      const entities = { normalisedData: data };
      const denormalizedData = denormalize(
        { normalisedData: Object.keys(data) },
        mySchema,
        entities
      );

      return denormalizedData.normalisedData;
    } else {
      throw "No data";
    }
  } catch (error) {
    return {};
  }
}

interface FilterNormalizedByKeywordType {
  list: {
    [key: string]: any;
  };
  options: {
    includeScore: boolean;
    keys: Array<string>;
  };
  keyword: string;
  returnIdsOnly?: boolean;
}

export function filterByKeywordWithNormalisedList({
  list,
  options,
  keyword,
  returnIdsOnly = false,
}: FilterNormalizedByKeywordType) {
  let options_ = {
    threshold: 0.3,
    ...options,
  };

  const items = Object.keys(list).map((id) => ({
    ...list[id],
  }));

  const fuse = new Fuse(items, options_);

  const fuseResult = fuse.search(keyword);

  let results = [];

  if (fuseResult.length > 0) {
    results = fuseResult.map((resultItem) => {
      return returnIdsOnly ? resultItem.item.id : resultItem.item;
    });
  }

  return results.reduce((prev, curr) => {
    if (curr.id !== undefined) {
      return {
        ...prev,
        [curr.id]: curr,
      };
    } else {
      return {
        ...prev,
        [curr.productId]: curr,
      };
    }
  }, {});
}
