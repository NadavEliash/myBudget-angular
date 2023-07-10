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
                "_id": "5a56640269f443a5d64b32ca",
                "name": "Ministry of Defense",
                "description": "Responsable on the army and the state's defence forces",
                "priority": 1,
                "imgUrl": 'https://www.svgrepo.com/show/480684/tank.svg'
            },
            {
                "_id": "5a5664025f6ae9aa24a99fde",
                "name": "National Care",
                "description": "Collects health insurance contributions which are transferred to the various sick funds, and National Insurance contributions, for which both employers and employees are liable",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/399571/i-social-services.svg'
            },
            {
                "_id": "5a56640252d6acddd183d319",
                "name": "Ministry of Justice",
                "description": "Responsable on the courts and the public persecution",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/429551/justice-court.svg'
            },
            {
                "_id": "5a169102ed1cf349f0c49b4g",
                "name": "Ministry of Construction",
                "description": "Responsable for construction and buildings over the state",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/383161/construction-machine-crane-lift.svg'
            },
            {
                "_id": "5a566402ed1cf349f0b47b4d",
                "name": "Ministry of Interior",
                "description": "Responsable on the municipalities. In addition, Responsable for citizen documentation and migration",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/454758/building-city-cityscape.svg'
            },
            {
                "_id": "5a566402abce24c6bfe4699d",
                "name": "Ministry of Helth",
                "description": "Responsable on the public hospitals, vaccination and public health centers",
                "priority": 1,
                "imgUrl": 'https://www.svgrepo.com/show/421941/health-injenction-medical.svg'
            },
            {
                "_id": "5a566402a6499c1d4da9220a",
                "name": "Ministry of Foreign Affairs",
                "description": "Responsable on embassies and delegations around the world",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/480954/earth-15.svg'
            },
            {
                "_id": "5a566402f90ae30e97f990db",
                "name": "Ministry of Education",
                "description": "Responsable on schools, universities",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/443633/education-cap.svg'
            },
            {
                "_id": "5a5664027bae84ef280ffbdf",
                "name": "Ministry of Agriculture",
                "description": "Responsable for Agriculture",
                "priority": 5,
                "imgUrl": 'https://www.svgrepo.com/show/447173/grain-organic.svg'
            },
            {
                "_id": "5a566402e3b846c5f6aec652",
                "name": "Ministry of Culture",
                "description": "Responsable for Culture",
                "priority": 6,
                "imgUrl": 'https://www.svgrepo.com/show/308686/literature-book-knowledge-library.svg'
            },
            {
                "_id": "5a56640272c7dcdf59c3d411",
                "name": "Ministry of Energy",
                "description": "Responsable for Energy",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/479959/energy-saving-light-bulb.svg'
            },
            {
                "_id": "5a5664029a8dd82a6178b15f",
                "name": "Ministry of Social Services",
                "description": "Responsable for Social Services",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/247609/care-charity.svg'
            },
            {
                "_id": "5a5664028c096d08eeb13a8a",
                "name": "Ministry of Religious Services",
                "description": "Responsable for Religious Services",
                "priority": 6,
                "imgUrl": 'https://www.svgrepo.com/show/235392/jewish.svg'
            },
            {
                "_id": "5a5664026c53582bb9ebe9d1",
                "name": "Ministry of National Security",
                "description": "Responsable for National Security",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/480776/police-car-1.svg'
            },
            {
                "_id": "5a56640298ab77236845b82b",
                "name": "Ministry of Labor",
                "description": "Responsable for Labor",
                "priority": 5,
                "imgUrl": 'https://www.svgrepo.com/show/300241/labor-man-labor.svg'
            },
            {
                "_id": "5a56640208fba3e8ecb97305",
                "name": "Ministry of Aliyah and Integration",
                "description": "Responsable for Integration",
                "priority": 4,
                "imgUrl": 'https://www.svgrepo.com/show/452583/airplane.svg'
            },
            {
                "_id": "5a566402abb3146207bc4ec5",
                "name": "Ministry of Economy",
                "description": "Responsable for Economy",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/444769/stats-pipes.svg'
            },
            {
                "_id": "5a56640298500fead8cb1ee5",
                "name": "Ministry of Sport",
                "description": "Responsable for Sport",
                "priority": 5,
                "imgUrl": 'https://www.svgrepo.com/show/370754/sport-football.svg'
            },
            {
                "_id": "5a56640243427b8f8445231e",
                "name": "Ministry of Environment Protection",
                "description": "Responsable for Environment",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/503806/earth.svg'
            },
            {
                "_id": "5a5664024e427b8f8515231t",
                "name": "Ministry of Transport",
                "description": "Responsable for Transportation",
                "priority": 3,
                "imgUrl": 'https://www.svgrepo.com/show/489186/train.svg'
            },
            {
                "_id": "5a5674024e427b8f8516131s",
                "name": "Minorities Integration",
                "description": "Responsable for Minorities",
                "priority": 5,
                "imgUrl": 'https://www.svgrepo.com/show/345044/people.svg'
            },
            {
                "_id": "5a5664025c3abdad6f5e098c",
                "name": "Prime Minister Office",
                "description": "Responsable for Minister Office",
                "priority": 2,
                "imgUrl": 'https://www.svgrepo.com/show/367626/polis.svg'
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

