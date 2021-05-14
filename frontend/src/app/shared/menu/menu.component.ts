import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, Event, ActivatedRoute, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    @Input()
    drawer!: MatDrawer;

    selectedItem: MenuItem | null = null;

    @Input()
    set menu(menuItems: { [key: string]: MenuItem }) {
        this.menuItems = menuItems;
        this.items = Object.keys(this.menuItems).map((key) => this.menuItems[key]);
    }

    menuItems: { [key: string]: MenuItem } = {};

    items: MenuItem[] = [];

    lastAppModule$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private router: Router, private route: ActivatedRoute) {
        this.router.events.pipe(
            filter((e: Event): e is ActivationEnd => e instanceof ActivationEnd)
        ).subscribe((e: ActivationEnd) => {
            if (e.snapshot.data.appModule) {
                this.lastAppModule$.next(e.snapshot.data.appModule.toUpperCase());
            }
        });
    }

    ngOnInit(): void {
        this.lastAppModule$.asObservable().subscribe((appModule: string | null) => {
            this.selectedItem = appModule ? this.menuItems[appModule] : null;
        });
    }

    selectItem(item: MenuItem | LinkMenuItem, close: boolean): void {
        if (item instanceof  MenuItem && item.items && item.items.length > 0) {
            this.selectedItem = item;
        }

        if (close) {
            this.drawer.close().then();
        }
    }

    back(): void {
        this.selectedItem = null;
        this.router.navigate(['.'], { relativeTo: this.route }).then();
    }

}

export class LinkMenuItem {
    constructor(
        public label: string,
        public icon: string,
        public routerLink: string[],
        public closeDrawer: boolean = true,
        public routerLinkActiveOptions: any = {exact: true},
        public routerLinkActive: string = 'route-active',
    ) { }
}

export class MenuItem {
    constructor(
        public label: string,
        public icon: string,
        public routerLink: string[],
        public items: LinkMenuItem[] = [],
        public closeDrawer: boolean = false,
        public routerLinkActiveOptions: any = {exact: false},
        public routerLinkActive: string = 'route-active',
    ) { }
}
