import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-page-example',
  standalone: true,
  imports: [],
  templateUrl: './page-example.component.html',
  styleUrl: './page-example.component.scss'
})
export class PageExampleComponent implements OnInit {

  initialWindowInner: number = 0
  initialVisualViewport: number = 0
  outputs: Array<string> = []

  onFocus(e: any): void {
    setTimeout(() => {
      this.outputs.push(`
        focus  ||| 
        now window: ${window.innerHeight}  ||| 
        initial window: ${this.initialWindowInner}  ||| 
        now visualViewport: ${window.visualViewport?.height || 0}  ||| 
        initial visualViewport: ${this.initialVisualViewport}
      `)
    }, 500)
    
  }

  onBlur(e: any): void {
    setTimeout(() => {
      this.outputs.push(`
        unfocus  ||| 
        now window: ${window.innerHeight}  ||| 
        initial window: ${this.initialWindowInner}  ||| 
        now visualViewport: ${window.visualViewport?.height || 0}  ||| 
        initial visualViewport: ${this.initialVisualViewport}
      `)
    }, 500)
  }

  ngOnInit(): void {
    this.initialWindowInner = window.innerHeight
    this.initialVisualViewport = window.visualViewport?.height || 0
  }

}
