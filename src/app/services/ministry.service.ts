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
    public sortBy$ = this._sortBy$.asObservable()

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
            priority: 10
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
        const newMinistry = new Ministry(ministry.name, ministry.description, ministry.priority);
        if (typeof newMinistry.setId === 'function') newMinistry.setId(this._getRandomId());
        return from(storageService.post(ENTITY, ministry))
            .pipe(
                tap(newMinistry => {
                    const ministries = this._ministries$.value
                    this._ministries$.next([...ministries, newMinistry])
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
                "_id": "5a56640269f443a5d64b32ca",
                "name": "Ministry of Defense",
                "description": "ochoahyde@renovize.com",
                "priority": 1
            },
            {
                "_id": "5a5664025f6ae9aa24a99fde",
                "name": "National Care",
                "description": "halliemclean@renovize.com",
                "priority": 1
            },
            {
                "_id": "5a56640252d6acddd183d319",
                "name": "Ministry of Justice",
                "description": "parsonsnorris@renovize.com",
                "priority": 3
            },
            {
                "_id": "5a566402ed1cf349f0b47b4d",
                "name": "Ministry of Interior",
                "description": "rachellowe@renovize.com",
                "priority": 2
            },
            {
                "_id": "5a566402abce24c6bfe4699d",
                "name": "Ministry of Helth",
                "description": "dominiquesoto@renovize.com",
                "priority": 1
            },
            {
                "_id": "5a566402a6499c1d4da9220a",
                "name": "Ministry of Foreign Affairs",
                "description": "shanapope@renovize.com",
                "priority": 4
            },
            {
                "_id": "5a566402f90ae30e97f990db",
                "name": "Ministry of Education",
                "description": "faulknerflores@renovize.com",
                "priority": 3
            },
            {
                "_id": "5a5664027bae84ef280ffbdf",
                "name": "Ministry of Agriculture",
                "description": "holderbean@renovize.com",
                "priority": 5
            },
            {
                "_id": "5a566402e3b846c5f6aec652",
                "name": "Ministry of Culture",
                "description": "rosanneshelton@renovize.com",
                "priority": 6
            },
            {
                "_id": "5a56640272c7dcdf59c3d411",
                "name": "Ministry of Energy",
                "description": "pamelanolan@renovize.com",
                "priority": 4
            },
            {
                "_id": "5a5664029a8dd82a6178b15f",
                "name": "Ministry of Social Services",
                "description": "roycantu@renovize.com",
                "priority": 2
            },
            {
                "_id": "5a5664028c096d08eeb13a8a",
                "name": "Ministry of Religious Services",
                "description": "olliechristian@renovize.com",
                "priority": 6
            },
            {
                "_id": "5a5664026c53582bb9ebe9d1",
                "name": "Ministry of National Security",
                "description": "nguyenwalls@renovize.com",
                "priority": 2
            },
            {
                "_id": "5a56640298ab77236845b82b",
                "name": "Ministry of Labor",
                "description": "glennasantana@renovize.com",
                "priority": 5
            },
            {
                "_id": "5a56640208fba3e8ecb97305",
                "name": "Ministry of Aliyah and Integration",
                "description": "maloneclark@renovize.com",
                "priority": 4
            },
            {
                "_id": "5a566402abb3146207bc4ec5",
                "name": "Ministry of Economy",
                "description": "floydrutledge@renovize.com",
                "priority": 5
            },
            {
                "_id": "5a56640298500fead8cb1ee5",
                "name": "Ministry of Sport",
                "description": "gracejames@renovize.com",
                "priority": 5
            },
            {
                "_id": "5a56640243427b8f8445231e",
                "name": "Ministry of Environment Protection",
                "description": "tannergates@renovize.com",
                "priority": 3
            },
            {
                "_id": "5a5664025c3abdad6f5e098c",
                "name": "Prime Minister Office",
                "description": "roham@renovize.com",
                "priority": 2
            }
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

