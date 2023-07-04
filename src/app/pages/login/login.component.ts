import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  userName: string = ''
  subscription!: Subscription

  async onLogin() {
    const user = await this.userService.getUser(this.userName)
    this.router.navigate(['/ministry'])
    console.log(user)
  }
}
