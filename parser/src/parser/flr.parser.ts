import { getRepository } from "typeorm";

import { flrAPI } from "../external_api/flr";
import { SourceCategory } from "shared/src/entity/SourceCategory";

const sourceId: number = 1;
const sourceName: string = 'freelancer';

interface ISubCategory extends SourceCategory {
    root: string;
}

export async function getAndSaveCategories() {
    let parsedCategories = await flrAPI.getCategories();

    const categoryRepository = getRepository(SourceCategory);

    let rootCategoriesToInsert: SourceCategory[] = [];
    let categoriesToInsert: ISubCategory[] = [];

    parsedCategories.forEach(parsedCategory => {
        let newCategory = new SourceCategory();

        newCategory.sourceId = sourceId;
        newCategory.sourceName = sourceName;
        newCategory.extId = Array.isArray(parsedCategory.extId) ? sourceName + parsedCategory.path : parsedCategory.extId;
        newCategory.path = sourceName + parsedCategory.path;
        newCategory.searchText = sourceName + " " + parsedCategory.name + (parsedCategory.url ? (" " + parsedCategory.url) : "");

        if (!parsedCategory.root) {
            rootCategoriesToInsert.push(newCategory);
        } else {
            categoriesToInsert.push({ ...newCategory, root: parsedCategory.root })
        }
    })

    let inserted = await categoryRepository.createQueryBuilder()
        .insert()
        .into(SourceCategory)
        .values(rootCategoriesToInsert)
        .onConflict(`("extId") DO UPDATE SET "path" = excluded."path", "searchText" = excluded."searchText"`)
        .returning(['path'])
        .execute();

    let rootCategoriesMap: Map<string, number> = new Map();

    inserted.generatedMaps.forEach(category => {
        rootCategoriesMap.set(category.path, category.id);
    })

    let categories = categoriesToInsert.map(category => {
        return {
            ...category,
            rootCategoryId: rootCategoriesMap.get(category.sourceName + category.root)
        }
    })

    // console.log(inserted, rootCategoriesMap, categories);

    let insertedCategories = await categoryRepository.createQueryBuilder()
        .insert()
        .into(SourceCategory)
        .values(categories)
        .onConflict(`("extId") DO UPDATE SET "path" = excluded."path", "searchText" = excluded."searchText", "rootCategoryId" = excluded."rootCategoryId"`)
        .returning(['path', 'rootCategoryId'])
        .execute();

    // console.log(insertedCategories.generatedMaps.slice(0, 10));
}