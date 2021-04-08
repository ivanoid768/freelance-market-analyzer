export interface ICategory {
    name: string;
    path: string;
    url: string;
    extId: string | string[];
    root?: string;
}

export interface ITask {

}

export interface ISourceAPI {
    getCategories(): Promise<ICategory[]>;
    getTasks(): Promise<ITask[]>;
}