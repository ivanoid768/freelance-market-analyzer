export interface ICategory {

}

export interface ITask {

}

export interface ISourceAPI {
    getCategories(): ICategory[];
    getTasks(): ITask[];
}