import { PaginatedResult, PaginationOptions, PostReturn, TableItem } from "src/app/models";

export interface FormApiService<T extends TableItem> {
    getById(id: number): Promise<T>;
    getPaginated(options: PaginationOptions): Promise<PaginatedResult<T>>;
    insert(item: T): Promise<PostReturn>;
    duplicate(item: T): Promise<PostReturn>;
    update(item: T): Promise<void>;
    remove(id: number): Promise<void>;
}
