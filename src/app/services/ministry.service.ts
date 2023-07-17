import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError } from 'rxjs';
import { storageService } from './async-storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ministry } from '../models/ministry.model';
import { Filter } from '../models/filter.model';

const ENTITY = 'ministries'

@Injectable({
    providedIn: 'root'
})

export class MinistryService {

    private _ministries$ = new BehaviorSubject<Ministry[]>([])
    public ministries$ = this._ministries$.asObservable()

    private _filterBy$ = new BehaviorSubject<Filter>({ term: '' })
    public filterBy$ = this._filterBy$.asObservable()

    private _sortBy$ = new BehaviorSubject<Filter>({ term: '' })
    // public sortBy$ = this._sortBy$.asObservable()

    constructor() {
        // Handling Demo Data, fetching from storage || saving to storage 
        const ministries = JSON.parse(localStorage.getItem(ENTITY) || 'null')
        if (!ministries || ministries.length === 0) {
            localStorage.setItem(ENTITY, JSON.stringify(this._createMinistries()))
        }
    }

    public setFilter(filter: Filter) {
        this._filterBy$.next(filter)
        this.loadMinistries().subscribe()
    }

    public setSort(sort: Filter) {
        this._sortBy$.next(sort)
        this.loadMinistries().subscribe()
    }

    public loadMinistries() {
        return from(storageService.query(ENTITY))
        .pipe(
            tap(ministries => {
                const filterBy = this._filterBy$.value
                    if (filterBy && filterBy.term) {
                        ministries = this._filter(ministries, filterBy.term)
                    }
                    const sortBy = this._sortBy$.value
                    if (sortBy && sortBy.term) {
                        ministries = this._sort(ministries, sortBy.term)
                    }
                    this._ministries$.next(ministries)
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    public getMinistryById(id: string): Observable<Ministry> {
        return from(storageService.get(ENTITY, id))
            .pipe(catchError(this._handleError))
    }

    public deleteMinistry(id: string) {
        return from(storageService.remove(ENTITY, id))
            .pipe(
                tap(() => {
                    let ministries = this._ministries$.value
                    ministries = ministries.filter(ministry => ministry._id !== id)
                    this._ministries$.next(ministries)
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    public saveMinistry(ministry: Ministry) {
        return ministry._id ? this._updateMinistry(ministry) : this._addMinistry(ministry)
    }

    public getEmptyMinistry() {
        return {
            name: '',
            description: '',
            priority: 3
        }
    }

    private _updateMinistry(ministry: Ministry) {

        return from(storageService.put(ENTITY, ministry))
            .pipe(
                tap(updatedMinistry => {
                    const ministries = this._ministries$.value
                    this._ministries$.next(ministries.map(ministry => ministry._id === updatedMinistry._id ? updatedMinistry : ministry))
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    private _addMinistry(ministry: Ministry) {
        // const newMinistry = new Ministry(ministry.name, ministry.description, ministry.priority);
        // if (typeof newMinistry.setId === 'function') newMinistry.setId(this._getRandomId());
        ministry._id = this._getRandomId()
        return from(storageService.post(ENTITY, ministry))
            .pipe(
                tap(newMinistry => {
                    const ministries = this._ministries$.value
                    this._ministries$.next([newMinistry, ...ministries])
                }),
                retry(1),
                catchError(this._handleError)
            )
    }

    private _sort(ministries: Ministry[], term: string): Ministry[] {
        if (term === 'name') {
            return ministries.sort((a, b) => {
                if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                    return -1;
                }
                if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                    return 1;
                }
                return 0
            })
        } else {
            return ministries.sort((a, b) => {
                if (a.priority < b.priority) {
                    return -1;
                }
                if (a.priority > b.priority) {
                    return 1;
                }
                return 0
            })
        }
    }

    private _filter(ministries: Ministry[], term: string) {
        term = term.toLocaleLowerCase()
        return ministries.filter(ministry => {
            return ministry.name.toLocaleLowerCase().includes(term) ||
                ministry.description.toLocaleLowerCase().includes(term)
        })
    }

    private _createMinistries() {
        const ministries = [
            {
                "_id": "5a5664025f6ae9aa24a99fde",
                "name": "National Careness and Social Services",
                "description": "Collects health insurance contributions which are transferred to the various sick funds, and National Insurance contributions, for which both employers and employees are liable",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/399571/i-social-services.svg'
            },
            {
                "_id": "5a56640269f443a5d64b32ca",
                "name": "Defense and Nation Security",
                "description": "Responsable on the army and the state's defence forces",
                "priority": 1,
                "imgUrl": 'https://www.svgrepo.com/show/480684/tank.svg'
            },
            {
                "_id": "5a56640252d6acddd183d319",
                "name": "Public Order and Justice",
                "description": "Responsable on the courts and the public persecution, Police and Emergency Agencies",
                "priority": 1,
                "imgUrl": 'https://www.svgrepo.com/show/429551/justice-court.svg'
            },
            {
                "_id": "5a56640243427b8f8445231e",
                "name": "Environment Protection",
                "description": "Responsable for Environment protection",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/503806/earth.svg'
            },
            {
                "_id": "5a566402abce24c6bfe4699d",
                "name": "Public Helth and Wellness",
                "description": "Responsable on the public hospitals, vaccination and public health centers",
                "priority": 1,
                "imgUrl": 'https://www.svgrepo.com/show/421941/health-injenction-medical.svg'
            },
            {
                "_id": "5a5674024e427b8f8516131s",
                "name": "Immigration Minorities",
                "description": "Responsable for Minorities",
                "priority": 5,
                "imgUrl": 'https://www.svgrepo.com/show/345044/people.svg'
            },
            {
                "_id": "5a566402f90ae30e97f990db",
                "name": "Education",
                "description": "Responsable on schools, universities",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/443633/education-cap.svg'
            },
            {
                "_id": "5a566402e3b846c5f6aec652",
                "name": "Culture and Sport",
                "description": "Responsable for Culture and sports",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/370754/sport-football.svg'
            },
            {
                "_id": "5a169102ed1cf349f0c49b4g",
                "name": "Construction and Development",
                "description": "Responsable for construction and buildings over the state",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/383161/construction-machine-crane-lift.svg'
            },
            {
                "_id": "5a566402ed1cf349f0b47b4d",
                "name": "Interior Affairs",
                "description": "Responsable on the municipalities. In addition, Responsable for citizen documentation and migration",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/454758/building-city-cityscape.svg'
            },
            {
                "_id": "5a566402a6499c1d4da9220a",
                "name": "Foreign Affairs",
                "description": "Responsable on embassies and delegations around the world",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/480954/earth-15.svg'
            },
            {
                "_id": "5a56640272c7dcdf59c3d411",
                "name": "Energy and Infrastructures",
                "description": "Responsable for Energy",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/479959/energy-saving-light-bulb.svg'
            },
        ];
        return ministries
    }

    private _handleError(err: HttpErrorResponse) {
        console.log('error in service:', err)
        return throwError(() => err)
    }

    private _getRandomId(length = 8): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

