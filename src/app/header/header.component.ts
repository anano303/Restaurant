import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { BasketService } from '../services/basket.service';
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
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
