export interface View {
    columnNames?: any[];
    results?: any[];
    noOfPages?: any;
    noOfRecords?: any;
    currentPageNumber?: number;
    pageSize?: number;
}

export interface Pagination {
    totalItems?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    startPage?: number;
    endPage?: number;
    startIndex?: number;
    endIndex?: number;
    pages?: number;
}

export interface SelectedPageDetails {
    page?: number;
    entriesPerPage?: number;
}
