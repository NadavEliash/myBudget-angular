import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, from, tap, retry, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../models/user.model';

const ENTITY = 'users'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _user$ = new BehaviorSubject<User>({ name: '', balance: 100, spend: [] })
  public user$ = this._user$.asObservable()

  constructor() { }

  public async getUser(userName: string): Promise<User> {
    const users = await this._query()
    let user = users.find(user => user.name === userName)
    if (!user) {
      user = {
        name: userName,
        balance: 100,
        spend: []
      }
      this._post(user)
    }
    return user;
  }

  private async _post(newUser: User): Promise<User> {
    const users = await this._query()
    users.push(newUser)
    this._save(users)
    return newUser
  }

  private async _query(delay = 10): Promise<User[]> {
    var users = JSON.parse(localStorage.getItem(ENTITY) || 'null') || []
    if (delay) {
      return new Promise((resolve) => setTimeout(resolve, delay, users))
    }
    return users
  }

  private _save(users: User[]) {
    localStorage.setItem(ENTITY, JSON.stringify(users))
  }

  private _handleError(err: HttpErrorResponse) {
    console.log('error in service:', err)
    return throwError(() => err)
  }
}