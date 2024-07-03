import { Component, forwardRef, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms'

@Component({
  selector: 'vg-input',
  standalone: true,
  imports: [ FormsModule ],
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

  value: string = ''
  onChange: Function = () => {}
  onTouched: Function = () => {}
  disabled: boolean = false

  modal: { x: number, y: number, w: number, h: number, visible: boolean } = { x: 0, y: 0, w: 0, h: 0, visible: false }

  textareaHeight: string = 'auto'

  intervalRefresh: any = null

  prevHeight: number = window.visualViewport?.height || 0

  @HostListener('window:resize') onResize(): void {
    if (this.modal.visible) {
      this.setSizeModal()
      this.setSizeTextarea()
    }
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

    if (this.prevHeight !== h) {
      this.hideModal()
    }

    this.prevHeight = h
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

  showModal(): void {
    this.modal.visible = true
    setTimeout(() => {
      this.textarea.nativeElement.focus()
      this.textarea.nativeElement.setSelectionRange(this.value.length, this.value.length)
      this.setSizeTextarea()
      setTimeout(() => {
        this.prevHeight = window.visualViewport?.height || 0
        this.intervalRefresh = setInterval(() => { this.refresh() })
      }, 500)
    }, 50)
  }

  hideModal(): void {
    this.modal.visible = false
    clearInterval(this.intervalRefresh)
    this.textarea.nativeElement.blur()
  }

  onClickInput(e: any): void {
    e.preventDefault()
    this.showModal()
  }

  onInputTextarea(e: any): void {

    this.setSizeTextarea()

  }

  ngOnInit(): void {
    this.setSizeModal()
  }

  ngOnDestroy(): void { }

}
