class Paginator {
    constructor(page = 1, limit = 9) {
        this.limit = parseInt(limit, 10);
        if (isNaN(this.limit) || this.limit < 1) {
            this.limit = 9;
        }
        this.page = parseInt(page, 10);
        if (isNaN(this.page) || this.page < 1) {  // Corrected to check `page` instead of `limit`
            this.page = 1;
        }
        this.offset = (this.page - 1) * this.limit;

        console.log(`Paginator initialized with page: ${this.page}, limit: ${this.limit}, offset: ${this.offset}`);
    }

    getMetadata(totalRecords) {
        if (totalRecords === 0) {
            return {};
        }
        let totalPages = Math.ceil(totalRecords / this.limit);
        return {
            totalRecords,
            firstPage: 1,
            lastPage: totalPages,
            page: this.page,
            limit: this.limit,
            hasNextPage: this.page < totalPages, 
            hasPrevPage: this.page > 1, 
        };
    }
}
module.exports = Paginator;
