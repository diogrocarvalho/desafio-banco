import { CrudModel } from '../../../shared/crud.model';
import { Group } from '../../group/shared/group.model';


export class User extends CrudModel {
    username: string | undefined;
    password: string | undefined;
    name: string | undefined;
    cpf: string | undefined;
    groups: Group[];
}
