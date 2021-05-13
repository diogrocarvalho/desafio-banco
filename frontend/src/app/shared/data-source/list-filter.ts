import { BehaviorSubject, fromEvent } from 'rxjs';
import * as moment from 'moment';
import { ElementRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


export class ListFilter {

    filters: { [filter: string]: string };
    filterChange: BehaviorSubject<{ [filter: string]: string }>;

    searchInput!: ElementRef

    constructor(filters: { [filter: string]: string}) {
        this.filters = filters;
        this.filterChange = new BehaviorSubject<{[p: string]: string}>(filters);
    }

    change(key: string, value: any): void {
        if (!(value instanceof String)) {
            value = value.toString();
        }

        this.filters[key] = value;
        this.filterChange.next(this.filters);
    }

    changeData(key: string, value: any): void {
        this.filters[key] = (value as moment.Moment).toISOString();
        this.filterChange.next(this.filters);
    }

    updateFiltersByObject(obj: any) {
      this.filters = {};

      Object.keys(obj).forEach(k => {
        if (!(obj[k] instanceof String)) {
          obj[k] = obj[k].toString();
        }
        this.filters[k] = obj[k];
      })

      this.filterChange.next(this.filters);
    }

    debouncedSearch(searchInput: ElementRef, debounceTimeInMs: number = 500, ) {
        if (!this.searchInput) {
            this.searchInput = searchInput;
            fromEvent(this.searchInput.nativeElement, 'keyup')
              .pipe(
                map((event: any) => {
                    return event.target.value;
                }),
                debounceTime(debounceTimeInMs),
                distinctUntilChanged()
              )
              .subscribe((text: string) => {
                  this.change('q', text);
              });
        }
    }
}
