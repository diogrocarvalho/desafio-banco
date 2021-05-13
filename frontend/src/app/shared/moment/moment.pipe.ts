import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {

    transform(date: Date,
              dateOnly = false,
              dateFormat: string = 'DD/MM/yyyy',
              timeFormat: string = 'HH:mm:ss'): string {

        if (date) {
            const d = moment(date).format(dateFormat);
            const t = moment(date).format(timeFormat);

            return dateOnly ? `${d}` : `${d} ${t}`;
        }

        return '';
    }

}
