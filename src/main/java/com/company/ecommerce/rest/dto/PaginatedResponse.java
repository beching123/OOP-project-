package com.company.ecommerce.rest.dto;

import java.util.List;

public class PaginatedResponse<T> {
    private List<T> data;
    private int total;
    private int page;
    private int pages;
    private int limit;

    public PaginatedResponse() {}

    public PaginatedResponse(List<T> data, int total, int page, int pages, int limit) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.pages = pages;
        this.limit = limit;
    }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public int getLimit() { return limit; }
    public void setLimit(int limit) { this.limit = limit; }
}
