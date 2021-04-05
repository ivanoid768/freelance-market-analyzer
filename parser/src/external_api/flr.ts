import { config } from "../config";
import { ICategory, ISourceAPI, ITask } from "../types";

class FlrAPI implements ISourceAPI {
    private BASE_URL = config.SOURCE_01_BASE_URL;

    public getCategories(): ICategory[] {
        
        throw new Error("Method not implemented.");
    }

    public getTasks(): ITask[] {
        throw new Error("Method not implemented.");
    }
}

export const flrAPI = new FlrAPI();