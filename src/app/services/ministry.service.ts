import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError } from 'rxjs';
import { storageService } from './async-storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Ministry } from '../models/ministry.model';

const ENTITY = 'ministries'

@Injectable({
  providedIn: 'root'
})

export class MinistryService {

  private _ministries$ = new BehaviorSubject<Ministry[]>([])
  public ministries$ = this._ministries$.asObservable()

  constructor(private http: HttpClient) {
      // Handling Demo Data, fetching from storage || saving to storage 
      const ministries = JSON.parse(localStorage.getItem(ENTITY) || 'null')
      if (!ministries || ministries.length === 0) {
          localStorage.setItem(ENTITY, JSON.stringify(this._createMinistries()))
      }
  }

  public loadMinistries() {
      return from(storageService.query(ENTITY))
          .pipe(
              tap(ministries => {
                  const filterBy = { term: '' }
                  if (filterBy && filterBy.term) {
                      ministries = this._filter(ministries, filterBy.term)
                  }
                  this._ministries$.next(this._sort(ministries))
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
          email: '',
          phone: ''
      }
  }


  private _updateMinistry(ministry: Ministry) {

      return from(storageService.post(ENTITY, ministry))
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
      const newMinistry = new Ministry(ministry.name, ministry.email, ministry.phone);
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

  private _sort(ministries: Ministry[]): Ministry[] {
      return ministries.sort((a, b) => {
          if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
              return -1;
          }
          if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
              return 1;
          }
          return 0;
      })
  }

  private _filter(ministries: Ministry[], term: string) {
      term = term.toLocaleLowerCase()
      return ministries.filter(ministry => {
          return ministry.name.toLocaleLowerCase().includes(term) ||
              ministry.phone.toLocaleLowerCase().includes(term) ||
              ministry.email.toLocaleLowerCase().includes(term)
      })
  }

  private _createMinistries() {
      const ministries = [
          {
              "_id": "5a56640269f443a5d64b32ca",
              "name": "Ministry of Defense",
              "email": "ochoahyde@renovize.com",
              "phone": "+1 (968) 593-3824"
          },
          {
              "_id": "5a5664025f6ae9aa24a99fde",
              "name": "Ministry of Finance",
              "email": "halliemclean@renovize.com",
              "phone": "+1 (948) 464-2888"
          },
          {
              "_id": "5a56640252d6acddd183d319",
              "name": "Ministry of Justice",
              "email": "parsonsnorris@renovize.com",
              "phone": "+1 (958) 502-3495"
          },
          {
              "_id": "5a566402ed1cf349f0b47b4d",
              "name": "Ministry of Interior",
              "email": "rachellowe@renovize.com",
              "phone": "+1 (911) 475-2312"
          },
          {
              "_id": "5a566402abce24c6bfe4699d",
              "name": "Ministry of Helth",
              "email": "dominiquesoto@renovize.com",
              "phone": "+1 (807) 551-3258"
          },
          {
              "_id": "5a566402a6499c1d4da9220a",
              "name": "Ministry of Foreign Affairs",
              "email": "shanapope@renovize.com",
              "phone": "+1 (970) 527-3082"
          },
          {
              "_id": "5a566402f90ae30e97f990db",
              "name": "Ministry of Education",
              "email": "faulknerflores@renovize.com",
              "phone": "+1 (952) 501-2678"
          },
          {
              "_id": "5a5664027bae84ef280ffbdf",
              "name": "Ministry of Agriculture",
              "email": "holderbean@renovize.com",
              "phone": "+1 (989) 503-2663"
          },
          {
              "_id": "5a566402e3b846c5f6aec652",
              "name": "Ministry of Culture",
              "email": "rosanneshelton@renovize.com",
              "phone": "+1 (968) 454-3851"
          },
          {
              "_id": "5a56640272c7dcdf59c3d411",
              "name": "Ministry of Energy",
              "email": "pamelanolan@renovize.com",
              "phone": "+1 (986) 545-2166"
          },
          {
              "_id": "5a5664029a8dd82a6178b15f",
              "name": "Ministry of Social Services",
              "email": "roycantu@renovize.com",
              "phone": "+1 (929) 571-2295"
          },
          {
              "_id": "5a5664028c096d08eeb13a8a",
              "name": "Ministry of Religious Services",
              "email": "olliechristian@renovize.com",
              "phone": "+1 (977) 419-3550"
          },
          {
              "_id": "5a5664026c53582bb9ebe9d1",
              "name": "Ministry of National Security",
              "email": "nguyenwalls@renovize.com",
              "phone": "+1 (963) 471-3181"
          },
          {
              "_id": "5a56640298ab77236845b82b",
              "name": "Ministry of Labor",
              "email": "glennasantana@renovize.com",
              "phone": "+1 (860) 467-2376"
          },
          {
              "_id": "5a56640208fba3e8ecb97305",
              "name": "Ministry of Aliyah and Integration",
              "email": "maloneclark@renovize.com",
              "phone": "+1 (818) 565-2557"
          },
          {
              "_id": "5a566402abb3146207bc4ec5",
              "name": "Ministry of Economy",
              "email": "floydrutledge@renovize.com",
              "phone": "+1 (807) 597-3629"
          },
          {
              "_id": "5a56640298500fead8cb1ee5",
              "name": "Ministry of Sport",
              "email": "gracejames@renovize.com",
              "phone": "+1 (959) 525-2529"
          },
          {
              "_id": "5a56640243427b8f8445231e",
              "name": "Ministry of Environment Protection",
              "email": "tannergates@renovize.com",
              "phone": "+1 (978) 591-2291"
          },
          {
              "_id": "5a5664025c3abdad6f5e098c",
              "name": "Prime Minister Office",
              "email": "roham@renovize.com",
              "phone": "+1 (842) 587-3812"
          }
      ];
      return ministries
  }

  private _handleError(err: HttpErrorResponse) {
      console.log('error in pet service:', err)
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

