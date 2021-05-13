import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';


@Component({
    selector: 'app-snack-message',
    templateUrl: './snack-message.component.html',
    styleUrls: ['./snack-message.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'snackbar',
    }
})
export class SnackMessageComponent {

    data: {message: string, action?: string, icon?: string, error?: boolean};

    constructor(private snackBarRef: MatSnackBarRef<SnackMessageComponent>,
                @Inject(MAT_SNACK_BAR_DATA) data: any) {
        this.data = data;
    }

    dismiss(): void {
        this.snackBarRef.dismissWithAction();
    }
}
