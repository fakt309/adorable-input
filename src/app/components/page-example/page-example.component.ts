import { Component, OnInit, HostListener } from '@angular/core'
import { FormControl } from '@angular/forms'
import { VgInputComponent } from '../vg-input/vg-input.component'

@Component({
  selector: 'app-page-example',
  standalone: true,
  imports: [
    VgInputComponent
  ],
  templateUrl: './page-example.component.html',
  styleUrl: './page-example.component.scss'
})
export class PageExampleComponent implements OnInit {

  testingWindow: any = { x: 0, y: 0, width: 0, height: 0 }

  inputControl: FormControl = new FormControl()

  // initialWindowInner: number = 0
  // initialVisualViewport: number = 0
  outputs: Array<string> = []

  onFocus(e: any): void {
    setTimeout(() => {
      this.setSizeTesting()
    }, 500)

    // setTimeout(() => {
    //   this.outputs.push(`
    //     focus
    //     now: ${window.visualViewport?.height || 0} ||| 
    //     initial: ${this.initialVisualViewport}
    //   `)
    // }, 2000)
    
  }

  onBlur(e: any): void {
    setTimeout(() => {
      this.setSizeTesting()
    }, 500)
    
    // setTimeout(() => {
    //   this.outputs.push(`
    //     unfocus  ||| 
    //     now: ${window.visualViewport?.height || 0} ||| 
    //     initial: ${this.initialVisualViewport}
    //   `)
    // }, 2000)
  }

  // detectDevice(): void {
  //   let nVer = navigator.appVersion;
  //   let nAgt = navigator.userAgent;
  //   let browserName  = navigator.appName;
  //   let fullVersion  = ''+parseFloat(navigator.appVersion); 
  //   let majorVersion = parseInt(navigator.appVersion,10);
  //   let nameOffset,verOffset,ix;

  //   // In Opera, the true version is after "OPR" or after "Version"
  //   if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
  //    browserName = "Opera";
  //    fullVersion = nAgt.substring(verOffset+4);
  //    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
  //      fullVersion = nAgt.substring(verOffset+8);
  //   }
  //   // In MS Edge, the true version is after "Edg" in userAgent
  //   else if ((verOffset=nAgt.indexOf("Edg"))!=-1) {
  //    browserName = "Microsoft Edge";
  //    fullVersion = nAgt.substring(verOffset+4);
  //   }
  //   // In MSIE, the true version is after "MSIE" in userAgent
  //   else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
  //    browserName = "Microsoft Internet Explorer";
  //    fullVersion = nAgt.substring(verOffset+5);
  //   }
  //   // In Chrome, the true version is after "Chrome" 
  //   else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
  //    browserName = "Chrome";
  //    fullVersion = nAgt.substring(verOffset+7);
  //   }
  //   // In Safari, the true version is after "Safari" or after "Version" 
  //   else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
  //    browserName = "Safari";
  //    fullVersion = nAgt.substring(verOffset+7);
  //    if ((verOffset=nAgt.indexOf("Version"))!=-1) 
  //      fullVersion = nAgt.substring(verOffset+8);
  //   }
  //   // In Firefox, the true version is after "Firefox" 
  //   else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
  //    browserName = "Firefox";
  //    fullVersion = nAgt.substring(verOffset+8);
  //   }
  //   // In most other browsers, "name/version" is at the end of userAgent 
  //   else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
  //             (verOffset=nAgt.lastIndexOf('/')) ) 
  //   {
  //    browserName = nAgt.substring(nameOffset,verOffset);
  //    fullVersion = nAgt.substring(verOffset+1);
  //    if (browserName.toLowerCase()==browserName.toUpperCase()) {
  //     browserName = navigator.appName;
  //    }
  //   }
  //   // trim the fullVersion string at semicolon/space if present
  //   if ((ix=fullVersion.indexOf(";"))!=-1)
  //      fullVersion=fullVersion.substring(0,ix);
  //   if ((ix=fullVersion.indexOf(" "))!=-1)
  //      fullVersion=fullVersion.substring(0,ix);

  //   majorVersion = parseInt(''+fullVersion,10);
  //   if (isNaN(majorVersion)) {
  //    fullVersion  = ''+parseFloat(navigator.appVersion); 
  //    majorVersion = parseInt(navigator.appVersion,10);
  //   }

  //   this.outputs.push(''
  //    +'Browser name  = '+browserName+'<br>'
  //    +'Full version  = '+fullVersion+'<br>'
  //    +'Major version = '+majorVersion+'<br>'
  //    +'navigator.appName = '+navigator.appName+'<br>'
  //    +'navigator.userAgent = '+navigator.userAgent+'<br>'
  //   )

  //   let userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  //   let os = null

  //   if (/windows phone/i.test(userAgent)) {
  //       os = "windowsPhone";
  //   }

  //   if (/android/i.test(userAgent)) {
  //       os = "android";
  //   }

  //   // iOS detection from: http://stackoverflow.com/a/9039885/177710
  //   if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
  //       os = "ios";
  //   }

  //   this.outputs.push(os || '')
  // }

  @HostListener('window:resize') onResize(): void {
    this.setSizeTesting()
  }

  setSizeTesting(): void {
    let w = window.visualViewport?.width || 0
    let h = window.visualViewport?.height || 0

    this.testingWindow.width = w
    this.testingWindow.height = h
  }

  ngOnInit(): void {
    this.setSizeTesting()
    // this.detectDevice()
    // this.initialWindowInner = window.innerHeight
    // this.initialVisualViewport = window.visualViewport?.height || 0
  }

}
