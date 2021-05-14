import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

    data: { title: string, entity: string };

    private yes$: Subject<void> = new Subject();

    yes = this.yes$.asObservable();

    constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
                @Inject(MAT_DIALOG_DATA) data: {title: string, entity: string}) {
        this.data = data;
    }

    onYes(): void {
        this.yes$.next();
        this.yes$.complete();
        this.dialogRef.close();
    }

}
