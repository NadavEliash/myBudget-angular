import { Injectable, Pipe } from '@angular/core';
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../models/user.model';

const ENTITY = 'users'
const LOGGEDIN_USER = 'LoggedinUser'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _loggedinUser$ = new BehaviorSubject<User>(this._getEmptyUser())
  public loggedinUser$ = this._loggedinUser$.asObservable()

  public getLoggedinUser() {
    const userName = sessionStorage.getItem(LOGGEDIN_USER)
    if (!userName) return null
    return this.setUser(userName).subscribe()
  }

  public setUser(userName: string) {
    return from(this._query())
      .pipe(
        tap(users => {
          let user = users.find(user => user.name === userName)
          if (!user) {
            user = this._getEmptyUser()
            user.name = userName
            this._post(user)
          }
          this._saveLoggedinUser(userName)
          this._loggedinUser$.next(user)
        })
      )
  }

  public logOut() {
    sessionStorage.setItem(LOGGEDIN_USER, '')
    this._loggedinUser$.next(this._getEmptyUser())
  }

  public updateSpending(user: User) {
    return from(this._put(user))
      .pipe(
        tap(user => {
          this._loggedinUser$.next(user)
        })
      )
  }

  private async _query(delay = 10): Promise<User[]> {
    var users = JSON.parse(localStorage.getItem(ENTITY) || 'null') || []
    if (delay) {
      return new Promise((resolve) => setTimeout(resolve, delay, users))
    }
    return users
  }

  private async _post(newUser: User): Promise<User> {
    const users = await this._query()
    users.push(newUser)
    this._save(users)
    return newUser
  }

  private async _put(updatedUser: User): Promise<User> {
    let users = await this._query()
    const idx = users.findIndex(user => user.name === updatedUser.name)
    users.splice(idx, 1)
    users.push(updatedUser)
    this._save(users)
    return updatedUser
  }

  private _save(users: User[]) {
    localStorage.setItem(ENTITY, JSON.stringify(users))
  }

  private _saveLoggedinUser(userName: string) {
    sessionStorage.setItem(LOGGEDIN_USER, userName)
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in service:', err)
    return throwError(() => err)
  }

  private _getEmptyUser(): User {
    return {
      name: '',
      balance: 100,
      spend: [{
        to: '',
        toId: '',
        amount: 0
      }]
    }
  }
}