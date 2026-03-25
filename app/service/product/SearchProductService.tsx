import AuthSessionService from "@/service/auth/AuthSessionService";
import { MeiliSearch } from "meilisearch";
import Environment from "@/shared/utils/Environment.tsx";

export default class SearchProductService {
    authSessionService: AuthSessionService;
    meilisearch: MeiliSearch;
    iniFields: any;
    meiliSearchIndex : any

    constructor(fields: {
        host: string,
        apiKey: string,
        index: string;
    }) {
        if (fields) Object.assign(this, fields);
        this.authSessionService = new AuthSessionService();
        this.iniFields = fields;
        this.meilisearch = new MeiliSearch({
            host: fields.host,
            apiKey: fields.apiKey,
        })
        this.meiliSearchIndex = this.meilisearch.index(this.iniFields.index);

    }



    async initialize() {
        try {
            await this.meiliSearchIndex.updateFilterableAttributes([
                'wholesales',
                'wholesales_status',
                'retail_status',
                'is_wholesales',
                'retail',
                'admin_status',
                'description',
                'name',
            ]);
            // Add sortable attributes for quantity
            await this.meiliSearchIndex.updateSortableAttributes([
                'wholesales.quantity',
                'retail.quantity',
            ]);
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }

    async query(query: string, page: number = 1, limit: number = 21) {
        try {

            const filter = Environment.isWholeSalesEnvironment()
                ? ['is_wholesales = true', 'admin_status = true', 'wholesales_status = true']
                : ['admin_status = true', 'retail_status = true'];

            const sort = Environment.isWholeSalesEnvironment()
                ? ['wholesales.quantity:desc']
                : ['retail.quantity:desc'];

            const offset = (page - 1) * limit;

            const response = await this.meiliSearchIndex.search(query, {
                limit,
                offset,
                matchingStrategy: 'frequency',
                filter,
                sort,
            });

            return {
                hits: response.hits,
                total: response.estimatedTotalHits || 0,
                currentPage: page,
                totalPages: Math.ceil((response.estimatedTotalHits || 0) / limit),
            };
        } catch (error) {
            console.error("Search error:", error);
            return {
                hits: [],
                total: 0,
                currentPage: page,
                totalPages: 0,
            };
        }
    }

}
