import { Injectable } from '@angular/core';
import { SnackMessageComponent } from './snack-message.component';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentType } from '@angular/cdk/overlay';


@Injectable({
    providedIn: 'root'
})
export class SnackService {

    private duration = 3;
    private $message: Subject<{component: ComponentType<unknown>, data: any, duration: number}> = new Subject();

    message = this.$message.asObservable();

    openSnack(message: string, action: string = 'fechar', duration: number = this.duration): void {

        this.$message.next({
            component: SnackMessageComponent,
            data: {
                message,
                action: action.toUpperCase()
            },
            duration
        });
    }

    showError(
      error: HttpErrorResponse | Error | Observable<any>,
      message?: string, action: string = 'fechar',
      duration: number = this.duration): void {
        if (error instanceof Observable) {
            error.subscribe(() => { }, (e: HttpErrorResponse) => {
                if (e.error.code === 800) {
                    this.sendErrorMessage(e, 'Houve violação nas restrições do banco de dados. ' +
                        'Verifique se existe um relacionamento com outra entidade.', action, duration);
                } else {
                    this.sendErrorMessage(e, message, action, duration);
                }
            });
        } else {
            this.sendErrorMessage(error, message, action, duration);
        }
    }

    private sendErrorMessage(
      error: HttpErrorResponse | Error ,
      message?: string,
      action: string = 'fechar',
      duration: number = this.duration): void {
        if (!message) {
            message = error.message;

            if (error instanceof HttpErrorResponse && error.error) {
                message = error.error.error;
            }

            if (error instanceof HttpErrorResponse && error.status === 500) {
                message = 'Erro interno no servidor. Entre em contato com o administrador do sistema.';
            }
        }

        this.$message.next({
            component: SnackMessageComponent,
            data: {
                message,
                icon: 'error',
                error: true,
                action: action.toUpperCase()
            },
            duration
        });
    }

}
