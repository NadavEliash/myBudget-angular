import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter, map, switchMap } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { MinistryService } from 'src/app/services/ministry.service';

@Component({
  selector: 'ministry-details',
  templateUrl: './ministry-details.component.html',
  styleUrls: ['./ministry-details.component.scss']
})
export class MinistryDetailsComponent implements OnInit {
  
  constructor(
    private minisrtyService: MinistryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ministry!: Ministry
  subscription!: Subscription

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => params['id']),
        filter(id => !!id),
        switchMap(id => this.minisrtyService.getMinistryById(id))
      )
      .subscribe(ministry => this.ministry = ministry)
  }
}
