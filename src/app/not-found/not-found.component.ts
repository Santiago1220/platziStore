import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
<div class="notfound">
  <img src="https://media.giphy.com/media/A9EcBzd6t8DZe/giphy.gif">
</div>`,
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
