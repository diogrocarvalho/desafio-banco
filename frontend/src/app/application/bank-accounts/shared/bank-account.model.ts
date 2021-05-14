import { CrudModel } from '../../../shared/crud.model';
import { User } from '../../user/shared/user.model';


export class BankAccount extends CrudModel {
    accountNumber: string | undefined;
    balance: number | undefined;
    cpf: number | undefined;
    username: number | undefined;
}
