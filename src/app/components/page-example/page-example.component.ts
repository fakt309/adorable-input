import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-page-example',
  standalone: true,
  imports: [],
  templateUrl: './page-example.component.html',
  styleUrl: './page-example.component.scss'
})
export class PageExampleComponent implements OnInit {

  initialHeight: number = 0
  outputs: Array<string> = []

  onFocus(e: any): void {
    setTimeout(() => {
      this.outputs.push(`focus (now: ${window.innerHeight}, initial: ${this.initialHeight})`)
    }, 500)
    
  }

  onBlur(e: any): void {
    setTimeout(() => {
      this.outputs.push(`unfocus (now: ${window.innerHeight}, initial: ${this.initialHeight})`)
    }, 500)
  }

  ngOnInit(): void {
    this.initialHeight = window.innerHeight
  }

}
