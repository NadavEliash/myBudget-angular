import { Component, Input } from '@angular/core';
import { Ministry } from 'src/app/models/ministry.model';

@Component({
  selector: 'ministry-preview',
  templateUrl: './ministry-preview.component.html',
  styleUrls: ['./ministry-preview.component.scss']
})
export class MinistryPreviewComponent {
  @Input() ministry!: Ministry
}
