import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';



@Injectable()
export class LoadingService {
    public loaderSubject = new BehaviorSubject<boolean>(false);
    loaderState = this.loaderSubject.asObservable();
    constructor() {
    }

    getLoader(): Observable<boolean> {
        return this.loaderState;
    }

    setLoader(isLoading: boolean): void {
        this.loaderSubject.next(isLoading);
    }


}
