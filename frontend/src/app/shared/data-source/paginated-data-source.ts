import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { PaginatedService } from './paginated-service';
import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {ListFilter} from './list-filter';
import { SnackService } from '../snack/snack-service';
import { CrudModel } from '../crud.model';


export class PaginatedDataSource<T extends CrudModel> extends DataSource<T> {

    private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    private params: HttpParams = new HttpParams();
    public items: T[] = [];
    public selection = new SelectionModel<T>(true, []);

    private lFilter: ListFilter | undefined;

    get filter(): ListFilter | undefined {
        return this.lFilter;
    }

    set filter(filter: ListFilter | undefined) {
        this.lFilter = filter;
        this.watchFilterEvents();
    }

    private lSort: MatSort | undefined;

    get sort(): MatSort | undefined {
        return this.lSort;
    }

    set sort(sort: MatSort | undefined) {
        this.lSort = sort;
        this.watchSortEvents();
    }

    private lPaginator: MatPaginator | undefined;

    get paginator(): MatPaginator | undefined {
        return this.lPaginator;
    }

    set paginator(paginator: MatPaginator | undefined) {
        this.lPaginator = paginator;
        this.watchPaginationEvents();
    }

    private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public loading: Observable<boolean> = this.loading$.asObservable();

    private isEmpty$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public isEmpty: Observable<boolean> = this.isEmpty$.asObservable();

    constructor(private service: PaginatedService<T>, private snackService?: SnackService, private parents: any[] = []) {
        super();

        this.data.subscribe((data: T[] | null) => this.items = data ? data : []);
    }

    update(): void {
        this.loading$.next(true);

        try {
            this.service.paginate(this.params, ...this.parents).subscribe((response: HttpResponse<T[]>) => {
              if (this.lPaginator) {
                this.lPaginator.length = Number(response.headers.get('X-Total-Count'));
              }

              this.data.next(response.body ? response.body : []);
              this.loading$.next(false);
              this.isEmpty$.next(!response.body || response.body.length === 0);
            }, (error: HttpErrorResponse) => {
                if (this.snackService) {
                    this.snackService.showError(error);
                    this.loading$.next(false);
                }
            });
        } catch (e) {
            this.loading$.next(false);
            this.snackService?.showError(e);
        }
    }

    watchPaginationEvents(): void {
        if (this.lPaginator) {
            const pageChange: Observable<PageEvent> =
                merge(this.lPaginator.page, this.lPaginator.initialized) as Observable<PageEvent>;

            pageChange.subscribe((pageEvent: PageEvent) => {
                if (pageEvent) {
                    this.setParam('page', pageEvent.pageIndex);
                    this.setParam('size', pageEvent.pageSize);
                } else if (this.lPaginator) {
                    this.setParam('size', this.lPaginator.pageSize);
                }

                this.update();
            });
        }
    }

    watchSortEvents(): void {
        if (this.lSort) {
            merge<Sort>(this.lSort.sortChange).subscribe((sort: Sort) => {
                this.handleSort(sort);
            });
        }
    }

    handleSort(sort: Sort): void {
      if (sort) {
        if (sort.direction) {
          this.setParam('sort', sort.active + ',' + sort.direction);
        } else {
          this.removeParam('sort');
        }
        this.update();
      }
    }

    watchFilterEvents(): void {
        if (this.lFilter) {
            this.lFilter.filterChange.subscribe((filters: { [p: string]: string }) => {
                for (const filter in filters) {
                    if (!filters[filter]) {
                        this.removeParam(filter);
                    } else {
                        this.setParam(filter, filters[filter]);
                        if (this.lPaginator) {
                          this.lPaginator.pageIndex = 0;
                          this.setParam('page', 0);
                        }
                    }
                }
                if (this.params.has('size') && this.params.has('page')) {
                    this.update();
                }
            });
        }
    }

    setParam(param: string, value: number | string): void {
        if (typeof value === 'number') {
            value = value.toString();
        }

        this.params = this.params.set(param, value);
    }

    removeParam(param: string): void {
        this.params = this.params.delete(param);
    }

    connect(): Observable<T[] | ReadonlyArray<T>> {
        return this.data;
    }

    disconnect(collectionViewer: CollectionViewer): void { }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.items.length;
        return numSelected === numRows;
    }

    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.items.forEach(row => this.selection.select(row));
    }

    updateParents(parents: any[]): void {
      this.parents = parents;
    }

}
