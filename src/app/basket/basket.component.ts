import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BasketService, BasketItem } from '../services/basket.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];
  totalPrice: number = 0;
  loading: boolean = false;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBasketItems();
  }

  loadBasketItems(): void {
    this.loading = true;
    this.basketService.loadBasket(); // Force reload basket data

    this.basketService.getBasketItems().subscribe((items) => {
      console.log('Basket items loaded:', items);

      // Log each item's id and productId for debugging
      items.forEach((item, index) => {
        console.log(
          `Item ${index}: id=${item.id}, productId=${item.productId}`
        );
      });

      this.basketItems = items;
      this.calculateTotal();
      this.loading = false;
    });
  }

  removeItem(item: BasketItem, index: number): void {
    console.log('Attempting to remove item:', item, 'at index:', index);

    // First, optimistically remove from the UI for instant feedback
    const localIndex = this.basketItems.findIndex(
      (i) => i === item // Compare by reference
    );

    if (localIndex > -1) {
      // Create a copy of the array for immutability
      this.basketItems = [
        ...this.basketItems.slice(0, localIndex),
        ...this.basketItems.slice(localIndex + 1),
      ];
      this.calculateTotal();
    }

    this.loading = true;

    // Pass the client-side index to help identify the item
    this.basketService
      .removeFromBasket(item.id, item.productId, index)
      .subscribe(
        () => {
          console.log('Item removed successfully from server');
          this.showNotification('✅ Item removed from cart');
          this.loading = false;
        },
        () => {
          // Even if there's an error, we've already updated the UI
          // so just show a message and don't roll back the change
          this.showNotification('Item removed from cart (local only)');
          this.loading = false;
        }
      );
  }

  updateQuantity(item: BasketItem, change: number): void {
    console.log('Updating quantity for item:', item, 'change:', change);
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      this.removeItem(item, this.basketItems.indexOf(item));
      return;
    }

    // First update locally for immediate feedback
    const index = this.basketItems.findIndex((i) => i === item);
    if (index !== -1) {
      // Create a new array with the updated item
      const updatedItems = [...this.basketItems];
      updatedItems[index] = {
        ...item,
        quantity: newQuantity,
      };

      this.basketItems = updatedItems;
      this.calculateTotal();
    }

    this.loading = true;
    const updatedItem = {
      ...item,
      quantity: newQuantity,
    };

    this.basketService.updateBasketItem(updatedItem).subscribe(
      () => {
        console.log('Quantity updated successfully');
        this.showNotification('Cart updated');
        this.loading = false;
      },
      (error) => {
        console.error('Error updating quantity:', error);
        this.showNotification(
          'Updated locally, but server may not be in sync',
          true
        );
        this.loading = false;
      }
    );
  }

  calculateTotal(): void {
    this.totalPrice = this.basketItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  checkout(): void {
    // Implement checkout functionality
    alert('Checkout functionality will be implemented soon!');
  }

  showNotification(message: string, isError: boolean = false): void {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = isError
      ? 'notification error'
      : 'notification success';

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  testDelete(item: BasketItem): void {
    // This will try all possible deletion methods
    (this.basketService as any).testDeleteMethods(item);

    // Also show a notification so the user knows we're trying
    this.showNotification('Testing different delete methods...');
  }
}
