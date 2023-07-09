import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter, map, switchMap } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { MinistryService } from 'src/app/services/ministry.service';

@Component({
  selector: 'ministry-edit',
  templateUrl: './ministry-edit.component.html',
  styleUrls: ['./ministry-edit.component.scss']
})

export class MinistryEditComponent implements OnInit {

  constructor(
    private minisrtyService: MinistryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ministry: Ministry = this.minisrtyService.getEmptyMinistry()
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

  onSaveMinistry() {
    this.subscription = this.minisrtyService.saveMinistry(this.ministry)
      .subscribe({
        next: () => this.router.navigate(['/ministry'])
      })
  }
}