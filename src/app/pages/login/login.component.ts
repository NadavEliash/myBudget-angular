import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  userName: string = ''
  user$!: Observable<User>
  subscription!: Subscription

  ngOnInit(): void {
    this.user$ = this.userService.loggedinUser$
  }

  onLogin() {
    this.subscription = this.userService.getUser(this.userName).subscribe()
    this.router.navigate(['/ministry'])
  }
}
