import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-page-example',
  standalone: true,
  imports: [],
  templateUrl: './page-example.component.html',
  styleUrl: './page-example.component.scss'
})
export class PageExampleComponent implements OnInit {

  initailHeight: number = 0
  outputs: Array<string> = []

  onFocus(e: any): void {
    this.outputs.push(`focus (now: ${window.innerHeight}, initial: ${this.initailHeight})`)
  }

  onBlur(e: any): void {
    this.outputs.push(`unfocus (now: ${window.innerHeight}, initial: ${this.initailHeight})`)
  }

  ngOnInit(): void {
    this.initailHeight = window.innerHeight
  }

}
