import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'momentIso' })
export class MomentIsoPipe implements PipeTransform {

    transform(date: any): string {
        return moment(date).toISOString();
    }

}
