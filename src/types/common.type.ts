export type PaginationResponseType<T> = {
    page: number,
    size: number,
    total: number,
    list: T[]
}