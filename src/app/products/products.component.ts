import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Product } from '../models/products.model';
import { ProductsService } from '../products.service';
import { BasketService } from '../services/basket.service';
import { CheckboxControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  categories = [
    { id: 1, name: 'Salads' },
    { id: 2, name: 'Soups' },
    { id: 3, name: 'Chicken-dishes' },
    { id: 4, name: 'Beef-dishes' },
    { id: 5, name: 'Seafood-dishes' },
    { id: 6, name: 'Vegetable-dishes' },
    { id: 7, name: 'Bits-bites' },
    { id: 8, name: 'On-the-Side' },
  ];
  selectedCategoryId: number | null = null;

  filters = {
    categoryId: undefined as number | undefined,
    vegeterian: undefined as boolean | undefined,
    nuts: undefined as boolean | undefined,
    spiciness: undefined as number | undefined,
  };

  constructor(
    private productService: ProductsService,
    private basketService: BasketService
  ) {}

  ngOnInit() {
    this.applyFilters();
    this.loadCategories();
  }

  loadCategories() {
    this.categories = [
      { id: 1, name: 'Salads' },
      { id: 2, name: 'Soups' },
      { id: 3, name: 'Chicken-dishes' },
      { id: 4, name: 'Beef-dishes' },
      { id: 5, name: 'Seafood-dishes' },
      { id: 6, name: 'Vegetable-dishes' },
      { id: 7, name: 'Bits-bites' },
      { id: 8, name: 'On-the-Side' },
    ];
  }

  fetchFilteredProducts(categoryId: number) {
    console.log('Fetching products for category:', categoryId);
    this.selectedCategoryId = categoryId;
    this.filters.categoryId = categoryId > 0 ? categoryId : undefined;
    this.applyFilters();
  }

  toggleFilter(filterType: string, event: any, value?: string) {
    if (filterType === 'nuts') {
      if (value === 'all') {
        this.filters.nuts = undefined;
      } else if (value === 'true') {
        this.filters.nuts = true;
      } else if (value === 'false') {
        this.filters.nuts = false;
      }
    } else if (filterType === 'vegeterian') {
      this.filters.vegeterian = event.target.checked;
    } else if (filterType === 'spiciness') {
      const value = event.target.value;
      this.filters.spiciness = value ? parseInt(value, 10) : undefined;
    }

    this.applyFilters();
  }

  resetFilters() {
    this.filters = {
      categoryId: undefined,
      vegeterian: undefined,
      nuts: undefined,
      spiciness: undefined,
    };

    const nutsRadioAll = document.querySelector(
      'input[name="nutsFilter"][value="all"]'
    ) as HTMLInputElement;
    if (nutsRadioAll) nutsRadioAll.checked = true;

    const spicySelect = document.querySelector(
      '.wiwakis-raodenoba'
    ) as HTMLSelectElement;
    if (spicySelect) spicySelect.value = '';

    const vegeterianCheckbox = document.querySelector(
      'input[data-filter="vegeterian"]'
    ) as HTMLInputElement;
    if (vegeterianCheckbox) vegeterianCheckbox.checked = false;

    // Reset to the current category or all products if no category selected
    if (this.selectedCategoryId) {
      this.fetchFilteredProducts(this.selectedCategoryId);
    } else {
      this.fetchFilteredProducts(0);
    }
  }

  applyFilters() {
    const params: any = {};

    if (this.filters.categoryId !== undefined) {
      params.categoryId = this.filters.categoryId;
    }

    if (this.filters.vegeterian !== undefined) {
      params.vegeterian = this.filters.vegeterian;
    }

    if (this.filters.nuts !== undefined) {
      params.nuts = this.filters.nuts;
    }

    if (this.filters.spiciness !== undefined) {
      params.spiciness = this.filters.spiciness;
    }

    console.log('Applying filters with params:', params);
    this.productService.getFilteredProducts(params).subscribe(
      (data) => {
        console.log('Products received:', data);
        this.products = data;
      },
      (error) => {
        console.error('Error fetching filtered products:', error);
      }
    );
  }

  addToCart(product: Product, event?: any): void {
    console.log('Adding to cart:', product);
    // Show button feedback
    const button = event?.target as HTMLElement;
    if (button) {
      button.classList.add('adding');
      button.textContent = 'Adding...';
    }

    this.basketService.addToBasket(product).subscribe(
      () => {
        console.log('Product added to cart successfully');
        this.showNotification(`✅ ${product.name} added to cart`, false, true);

        // Reset button after a delay
        setTimeout(() => {
          if (button) {
            button.classList.remove('adding');
            button.textContent = 'Add to cart';
          }
        }, 500);
      },
      (error) => {
        console.error('Error adding to basket:', error);
        this.showNotification('❌ Failed to add to cart', true);

        // Reset button immediately
        if (button) {
          button.classList.remove('adding');
          button.textContent = 'Add to cart';
        }
      }
    );
  }

  showNotification(
    message: string,
    isError: boolean = false,
    isCart: boolean = false
  ): void {
    console.log('Showing notification:', message, isError);

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = isError
      ? 'notification error'
      : isCart
      ? 'notification cart-success'
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
}
