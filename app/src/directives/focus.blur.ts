import { Directive, HostListener, Renderer, ElementRef } from '@angular/core';

@Directive({
    selector: '[appFocusBlur]'
})
export class FocusBlurDirective {

    constructor(private renderer: Renderer, private el: ElementRef ) {}
    // Event listeners for element hosting
    // the directive
    @HostListener('focus') focus() {
        this.toggleClass(true);
    }

    @HostListener('blur') blur() {
        this.toggleClass(false);
    }
    // Event method to be called on mouse enter and on mouse leave
    toggleClass(shouldAdd: boolean) {
        if (shouldAdd) {
            this.renderer.setElementClass(this.el.nativeElement, 'ng-active', true);
            this.renderer.setElementClass(this.el.nativeElement, 'ng-blur', false);
        } else {
            this.renderer.setElementClass(this.el.nativeElement, 'ng-blur', true);
            this.renderer.setElementClass(this.el.nativeElement, 'ng-active', false);
        }
    }
}
