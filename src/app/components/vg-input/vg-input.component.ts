import { Component, forwardRef, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, Input, Renderer2 } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'vg-input',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VgInputComponent),
      multi: true
    }
  ],
  templateUrl: './vg-input.component.html',
  styleUrl: './vg-input.component.scss'
})
export class VgInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild('textarea', { read: ElementRef }) textarea!: ElementRef

  @Input() title: string = ''
  @Input() rule: (t1: string) => Promise<{ success: boolean; error: string }> = async (value: string): Promise<{ success: boolean; error: string }> => new Promise((res) => {
    res({ success: true, error: '' })
  })

  os: 'windows' | 'android' | 'ios' | 'unknown' = 'unknown'

  value: string = ''
  onChange: Function = () => {}
  onTouched: Function = () => {}
  disabled: boolean = false

  error: string = ''

  modal: { x: number, y: number, w: number, h: number, visible: boolean } = { x: 0, y: 0, w: 0, h: 0, visible: false }

  textareaHeight: string = 'auto'

  intervalRefresh: any = null

  prevHeight: number = window.visualViewport?.height || 0
  prevBodyOverflow: string = ''
  prevBodyPosition: string = ''
  prevMetaViewPort: string = ''

  constructor(private renderer: Renderer2) {}

  @HostListener('window:resize') onResize(): void {
    if (this.modal.visible) {
      this.setSizeModal()
      this.setSizeTextarea()
    }
  }

  getMobileOperatingSystem(): 'windows' | 'android' | 'ios' | 'unknown' {
    var userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    if (/windows phone/i.test(userAgent)) {
      return 'windows'
    }

    if (/android/i.test(userAgent)) {
      return 'android'
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios'
    }

    return 'unknown'
  }

  writeValue(value: string): void {
    this.value = value
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  refresh(): void {
    if (!this.modal.visible) {
      this.hideModal()
      return
    }

    const h: number = window.visualViewport?.height || 0

    this.setSizeModal()
    this.setSizeTextarea()

    if (this.prevHeight < h) {
      this.hideModal()
    }

    this.prevHeight = h
  }

  async checkError(): Promise<void> {
    const result = await this.rule(this.value)
    if (result.success) {
      this.error = ''
    } else {
      this.error = result.error
    }
  }

  setSizeModal(): void {
    let w = window.visualViewport?.width || 0
    let h = window.visualViewport?.height || 0

    this.modal.w = w
    this.modal.h = h
  }

  setSizeTextarea(): void {
    const textarea = this.textarea.nativeElement
    const padding = window.getComputedStyle(textarea, null).getPropertyValue('padding');
    const paddingValue = parseFloat(padding)*2
    textarea.style.height = '0px'
    textarea.style.height = `${textarea.scrollHeight-paddingValue}px`
  }

  async focusAndOpenKeyboardIOS(el: any, timeout: number): Promise<void> {
    // if (!timeout) {
    //   timeout = 100
    // }
    // if (el) {
      // Align temp input element approximately where the input element is
      // so the cursor doesn't jump around
      let __tempEl__ = document.createElement('input')
      __tempEl__.style.position = 'absolute'
      __tempEl__.style.top = (el.offsetTop + 7) + 'px'
      __tempEl__.style.left = el.offsetLeft + 'px'
      __tempEl__.style.height = `0`
      __tempEl__.style.opacity = `0`
      // Put this temp element as a child of the page <body> and focus on it
      document.body.appendChild(__tempEl__)
      __tempEl__.focus()

      // The keyboard is open. Now do a delayed focus on the target element
      return new Promise(res => {
        setTimeout(() => {
          el.focus()
          el.click()
          el.setSelectionRange(this.value.length, this.value.length)
          // Remove the temp element
          document.body.removeChild(__tempEl__)

          res()
        }, timeout)
      })
      
    // }
  }

  showModal(): void {
    let metaViewport = document.querySelector('meta[name="viewport"]')
    if (metaViewport) {
      this.prevMetaViewPort = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || ''
      this.renderer.setAttribute(metaViewport, 'content', 'width=device-width, height=device-height, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content')
    }
    this.prevBodyOverflow = document.body.style.overflow
    this.prevBodyPosition = document.body.style.position
    // document.body.style.position = 'fixed'
    document.body.style.overflow = 'hidden'

    this.modal.visible = true
    this.checkError()

    // setTimeout(() => {
    //   this.error = this.textarea.nativeElement.value
    //   this.textarea.nativeElement.click()
    //   this.textarea.nativeElement.focus()
    //   // this.focusAndOpenKeyboardIOS(this.textarea.nativeElement as any, 1000).then(() => {
    //   //   // this.error = 'thats all'
    //   //   // this.setSizeTextarea()
    //   //   // setTimeout(() => {
    //   //   //   this.prevHeight = window.visualViewport?.height || 0
    //   //   //   this.intervalRefresh = setInterval(() => { this.refresh() })
    //   //   // }, 500)
    //   // })
    // }, 1000)

    setTimeout(() => {
      this.textarea.nativeElement.focus()
      this.textarea.nativeElement.setSelectionRange(this.value.length, this.value.length)
      this.setSizeTextarea()
      setTimeout(() => {
        this.prevHeight = window.visualViewport?.height || 0
        this.intervalRefresh = setInterval(() => { this.refresh() })
      }, 500)
    }, 50)

    // if (this.os === 'ios') {
    //   this.focusAndOpenKeyboardIOS(this.textarea.nativeElement, 500)
    // } else {
    //   setTimeout(() => {
    //     this.textarea.nativeElement.focus()
    //     this.textarea.nativeElement.setSelectionRange(this.value.length, this.value.length)
    //     this.setSizeTextarea()
    //     setTimeout(() => {
    //       this.prevHeight = window.visualViewport?.height || 0
    //       this.intervalRefresh = setInterval(() => { this.refresh() })
    //     }, 500)
    //   }, 50)
    // }
    
  }

  hideModal(): void {
    document.body.style.overflow = this.prevBodyOverflow
    // document.body.style.position = this.prevBodyPosition
    let metaViewport = document.querySelector('meta[name="viewport"]')
    if (metaViewport) {
      this.renderer.setAttribute(metaViewport, 'content', this.prevMetaViewPort)
    }

    this.modal.visible = false
    clearInterval(this.intervalRefresh)
    this.textarea.nativeElement.blur()
  }

  onClickInput(e: any): void {
    e.preventDefault()
    this.showModal()
  }

  onInputTextarea(e: any): void {

    let value: string = e.target.value

    this.value = value

    this.setSizeTextarea()
    this.checkError()
    
    this.onChange(value)

  }

  ngOnInit(): void {
    this.os = this.getMobileOperatingSystem()

    this.checkError()
    this.setSizeModal()
  }

  ngOnDestroy(): void { }

}
