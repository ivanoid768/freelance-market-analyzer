import { config } from "../config";
import { ICategory, ISourceAPI, ITask } from "../types";
import axios from 'axios';
import { parse } from 'node-html-parser';

interface ICtg {
    job_id: string;
    name: string;
    seo_url: string;
}

interface ICategoryAPIResp {
    status: 'success' | string;
    results: ICtg[]
}

interface IAPITask {
    project_desc: string;
    project_id: number;
    project_name: string;
    seo_url: string;
    bid_count: number;
    bid_avg: string | false;
    budget_range: string;
    maxbudget: string;
    minbudget: string;
    time_left: string;
    NDA: boolean;
    featured: boolean;
    fulltime: boolean;
    guaranteed: boolean;
    has_upgrades: boolean;
    highlight: boolean;
    is_contest: boolean;
    local: boolean;
    payment_verified: string;
    sealed: boolean;
    top: boolean;
    urgent: boolean;
}

interface ITaskAPIResp {
    aaData: IAPITask[];
    iTotalDisplayRecords: number;
    iTotalRecords: number;
    sEcho: number;
    tagData: any[];
}

class FlrAPI implements ISourceAPI {
    private BASE_URL = config.SOURCE_01_BASE_URL;

    public async getCategories(): Promise<ICategory[]> {
        let categoryHTMLResp = await this.requestCategories();

        let parsedHTML = parse(categoryHTMLResp.data);
        let categoryTitleList = parsedHTML.querySelectorAll('.PageJob-browse .PageJob-category');
        let rootCategories = categoryTitleList.map(el => {
            let tagId = el.getAttribute('id');

            let elTitle = el.querySelector('.PageJob-category-title')
            let name = elTitle.textContent.trim().replace(/\(\d+\)/i, '').replace(/&amp;/i, '&').trim().toLocaleLowerCase();
            let path = `/${name}`.toLocaleLowerCase().replace(/\s+/ig, '-').replace(/\,+/ig, '');

            return {
                name,
                path,
                url: null,
                extId: [],
                tagId
            }
        })

        let ctgAPIResp = await this.requestCategoriesViaAPI();

        let ctgs = ctgAPIResp.data.results;
        let ctgsMap = new Map<string, ICtg>();
        ctgs.forEach(skill => {
            ctgsMap.set(skill.seo_url + '/', skill);
        })

        let categories: ICategory[] = [];

        rootCategories.map(rootCategory => {
            let categoryList = parsedHTML.querySelectorAll(`.PageJob-browse .PageJob-category#${rootCategory.tagId} .PageJob-category-link`);

            let ctgs = categoryList.map(ctgTag => {
                let name = ctgTag.textContent.trim().replace(/\(\d+\)/i, '').replace(/&nbsp;/i, '').trim().toLocaleLowerCase();
                let path = `/${name}`.toLocaleLowerCase().replace(/\s+/ig, '-').replace(/\,+/ig, '');
                let url = ctgTag.getAttribute('href');

                if (!name) {
                    name = url.match(/contest\/([^/]+)\//i)?.[1];

                    if(name){
                        path = `/${name}/contest`; //TODO: replace 'dot-net-core' with '.net-core'
                    }

                    name = `${name} contest`;
                }

                let extId = ctgsMap.get(url)?.job_id;
                if (!extId) {
                    extId = url;
                }

                rootCategory.extId.push(extId);

                return {
                    name,
                    path: rootCategory.path + path,
                    url,
                    extId,
                    root: rootCategory.path,
                }
            })

            categories.push(...ctgs);
        })

        categories.push(...rootCategories);

        return categories;
    }

    public async getTasks(categoryIds: string[], page: number = 1, perPage: number = 50): Promise<ITask[]> {
        let taskAPIResp = await this.requestTasksViaAPI(categoryIds, page, perPage);

        let respTasks = taskAPIResp.data.aaData;

        let tasks: ITask[] = respTasks.map(rTask => {
            let priceMin = parseFloat(rTask.minbudget.replace('$', ''));
            let priceMax = parseFloat(rTask.maxbudget.replace('$', ''));
            let price = ((priceMax + priceMin) / 2);

            if (rTask.bid_avg) {
                let priceBidAvg = parseFloat(rTask.bid_avg.replace('$', ''));
                price = priceBidAvg <= priceMax ? priceBidAvg : priceMax;
            }

            let paymentType: 'hourly' | 'fixed' = 'fixed';

            if (rTask?.budget_range?.indexOf('/ hr') !== -1) {
                paymentType = 'hourly';
            }

            let timeLeft = rTask.time_left;

            return {
                extId: rTask.project_id.toString(),
                name: rTask.project_name,
                url: this.BASE_URL + rTask.seo_url,
                description: rTask.project_desc,
                bidCount: rTask.bid_count,
                priceType: 'fixed',
                paymentType,
                price: price,
                timeLeft,
            }
        })

        return tasks;
    }

    private async requestCategories() {
        return axios.get(`${this.BASE_URL}/job/`, {
            headers: {
                Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
            },
        })
    }

    private async requestCategoriesViaAPI() {
        return axios.get<ICategoryAPIResp>(`${this.BASE_URL}/ajax/search/allSkills.php`);
    }

    private async requestTasksViaAPI(categoryExtIds: string[], page: number = 1, perPage: number = 50) {
        let offset = (page - 1) * perPage;

        return axios.get<ITaskAPIResp>(`${this.BASE_URL}/ajax/table/project_contest_datatable.php`, {
            headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
            },
            params: {
                tag: null,
                type: false,
                budget_min: false,
                budget_max: false,
                contest_budget_min: false,
                contest_budget_max: false,
                hourlyrate_min: false,
                hourlyrate_max: false,
                hourlyProjectDuration: false,
                skills_chosen: categoryExtIds.length > 0 ? categoryExtIds.join(',') : false,
                languages: false,
                status: 'open',
                vicinity: false,
                countries: false,
                lat: false,
                lon: false,
                iDisplayStart: offset,
                iDisplayLength: perPage,
                iSortingCols: 1,
                iSortCol_0: 6,
                sSortDir_0: 'desc',
                format_version: 3,
            }
        });
    }
}

export const flrAPI = new FlrAPI();