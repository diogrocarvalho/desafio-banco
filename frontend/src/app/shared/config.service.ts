import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ConfigService {

    getSettings(): Settings {
        return environment as Settings;
    }

}

export class Settings {

    production!: boolean;
    apiURL!: string;

}

