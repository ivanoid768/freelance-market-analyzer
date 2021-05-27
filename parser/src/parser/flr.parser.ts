import { getRepository } from "typeorm";

import { flrAPI } from "../external_api/flr";
import { SourceCategory } from "shared/src/entity/SourceCategory";
import { PaymentType, PriceType, Task } from "shared/src/entity/Task";
import { config } from "src/config";

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
        .onConflict(`("extId") DO UPDATE SET "path" = excluded."path", "searchText" = excluded."searchText",`
            + ` "rootCategoryId" = excluded."rootCategoryId"`)
        .returning(['path', 'rootCategoryId'])
        .execute();

    // console.log(insertedCategories.generatedMaps.slice(0, 10));
    console.info(`Flr categories updated. Count: ${insertedCategories.generatedMaps.length}`);
}

export async function getAndSaveTasks(categoryIds: number[]) {
    const page_count = config.FLR_PAGE_COUNT;

    const categoryRepository = getRepository(SourceCategory);
    const categories = await categoryRepository.findByIds(categoryIds, { select: ["id", "extId"] });

    const taskRepository = getRepository(Task);

    for (const category of categories) {
        for (let pageIdx = 1; pageIdx <= page_count; pageIdx++) {
            let parsedTasks = await flrAPI.getTasks([category.extId], pageIdx);

            if (!parsedTasks.length) {
                break;
            }

            let taskToInsert = parsedTasks.map(parsedTask => {
                let task = new Task();
                task.sourceId = sourceId;
                task.sourceName = sourceName;

                task.extId = parsedTask.extId;

                task.name = parsedTask.name;
                task.description = parsedTask.description;
                task.categoryId = category.id;

                task.bidCount = parsedTask.bidCount;
                task.price = parsedTask.price;
                task.priceType = parsedTask.priceType === "deal" ? PriceType.DEAL : PriceType.ABOUT;
                task.paymentType = parsedTask.paymentType === 'hourly' ? PaymentType.HOURLY : PaymentType.FIXED;

                task.url = parsedTask.url;
                task.searchText = `${parsedTask.name} ${parsedTask.description} ${parsedTask.url} ${sourceName}`;

                return task;
            })

            let insertedTasks = await taskRepository.createQueryBuilder()
                .insert()
                .into(Task)
                .values(taskToInsert)
                .onConflict(`("extId") DO UPDATE SET "name" = excluded."name", "description" = excluded."description",`
                    + ` "categoryId" = excluded."categoryId",`
                    + ` "bidCount" = excluded."bidCount",`
                    + ` "price" = excluded."price",`
                    + ` "priceType" = excluded."priceType",`
                    + ` "paymentType" = excluded."paymentType",`
                    + ` "url" = excluded."url",`
                    + ` "searchText" = excluded."searchText"`)
                .returning(['name', 'categoryId'])
                .execute();

            // console.log(insertedTasks.generatedMaps[0], insertedTasks.generatedMaps.length);
            console.info(`Flr tasks updated. Count: ${insertedTasks.generatedMaps.length}`);
        }
    }
}