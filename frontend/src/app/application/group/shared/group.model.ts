import { CrudModel } from '../../../shared/crud.model';
import { Authority } from '../../authority/shared/authority.model';


export class Group extends CrudModel {
    name!: string;
    authorities: Authority[];
}
