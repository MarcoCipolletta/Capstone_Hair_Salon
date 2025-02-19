import { Component, HostListener, inject, ElementRef } from '@angular/core';
import { AuthSvc } from '../../auth/auth.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private elementRef: ElementRef, private authSvc: AuthSvc) {}

  isLogged: boolean = false;
  role: string = '';

  isCollapsed: boolean = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCollapsed = true;
    }
  }
  ngOnInit() {
    combineLatest([this.authSvc.isLogged$, this.authSvc.userRole$]).subscribe(
      ([isLogged, role]) => {
        if (isLogged) {
          this.isLogged = isLogged;
          this.role = role;
        } else {
          this.isLogged = isLogged;
          this.role = role;
        }
      }
    );
  }
  logout() {
    this.authSvc.logout();
    this.isCollapsed = true;
  }
}
