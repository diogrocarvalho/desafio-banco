import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { CrudModel } from '../crud.model';


export interface PaginatedService<T extends CrudModel> {

    paginate(params: HttpParams, ...parents: any[]): Observable<HttpResponse<T[]>>;

}
