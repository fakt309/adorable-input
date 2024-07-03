import { Component, forwardRef, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, Input } from '@angular/core'
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

  showModal(): void {
    this.prevBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    this.modal.visible = true
    this.checkError()
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
    document.body.style.overflow = this.prevBodyOverflow
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
    this.checkError()
    this.setSizeModal()
  }

  ngOnDestroy(): void { }

}
