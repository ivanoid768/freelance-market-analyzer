import { config } from "../config";
import { ICategory, ISourceAPI, ITask } from "../types";
import axios from 'axios';
import { parse } from 'node-html-parser';

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
                tagId
            }
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
                    name = `${name} contest`;
                }

                return {
                    name,
                    path: rootCategory.path + path,
                    url,
                }
            })

            categories.push(...ctgs);
        })

        categories.push(...rootCategories);
        
        return categories;
    }

    public getTasks(): Promise<ITask[]> {
        throw new Error("Method not implemented.");
    }

    private async requestCategories() {
        return axios.get(`${this.BASE_URL}/job/`, {
            headers: {
                Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
            },
        })
    }
}

export const flrAPI = new FlrAPI();