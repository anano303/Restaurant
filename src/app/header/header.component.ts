import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BasketService } from '../services/basket.service';

@Injectable({
  providedIn: 'root',
})
export class basketService {
  private cartItemCountSubject = new BehaviorSubject<number>(0);

  constructor() {}

  getTotalItems(): Observable<number> {
    return this.cartItemCountSubject.asObservable();
  }

  updateItemCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;
  isMenuOpen: boolean = false;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketService.getTotalItems().subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevent body scrolling when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const navigation = document.querySelector('.navigation');
    const hamburger = document.querySelector('.hamburger');

    if (
      this.isMenuOpen &&
      navigation &&
      hamburger &&
      !navigation.contains(clickedElement) &&
      !hamburger.contains(clickedElement)
    ) {
      this.closeMenu();
    }
  }

  // Close menu on window resize
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}
