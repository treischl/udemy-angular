import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appDropdown]",
})
export class DropdownDirective {
  isShown: boolean = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener("document:click", ["$event"]) toggleMenu(event: Event) {
    const menuEl = (this.elRef.nativeElement as Element).querySelector(
      ".dropdown-menu",
    );
    if (!menuEl) return;

    this.isShown = this.elRef.nativeElement.contains(event.target)
      ? !this.isShown
      : false;

    if (this.isShown) {
      this.renderer.setStyle(menuEl, "display", "block");
    } else {
      this.renderer.removeStyle(menuEl, "display");
    }
  }
}
