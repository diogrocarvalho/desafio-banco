import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'role'})
export class RolePipe implements PipeTransform {

    transform(role: string): string {
        switch (role) {
            case 'ADMIN': { return 'Administrador'; }
            case 'USER': { return 'Comum'; }
            default: { return '-'; }
        }
    }

}
