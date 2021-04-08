export interface ICategory {
    name: string;
    path: string;
    url: string;
    extId: string | string[];
    root?: string;
}

export interface ITask {
    extId: string;
    name: string;
    url: string;
    description: string;
    price: number;
    bidCount: number;
    priceType: 'deal' | 'range' | 'fixed';
    paymentType: 'hourly' | 'fixed';
    timeLeft: string | Date;
}

export interface ISourceAPI {
    getCategories(): Promise<ICategory[]>;
    getTasks(categoryIds: string[], page: number, perPage: number): Promise<ITask[]>;
}