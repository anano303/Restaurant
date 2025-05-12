import { Component, OnInit } from '@angular/core'; // კომპონენტისა და OnInit ინტერფეისის იმპორტი
import { CommonModule } from '@angular/common'; // სტანდარტული Angular მოდულების იმპორტი (ngIf, ngFor და ა.შ.)
import { Product } from '../models/products.model'; // პროდუქტის მოდელის იმპორტი
import { ProductsService } from '../products.service'; // პროდუქტების სერვისის იმპორტი
import { BasketService } from '../services/basket.service'; // კალათის სერვისის იმპორტი
import { FormsModule } from '@angular/forms'; // ფორმების მოდულის იმპორტი (ngModel-ისთვის)

@Component({
  selector: 'app-products', // კომპონენტის სელექტორი HTML-ში გამოსაყენებლად
  standalone: true, // დამოუკიდებელი კომპონენტის მითითება
  imports: [CommonModule, FormsModule], // საჭირო მოდულების იმპორტი კომპონენტისთვის
  templateUrl: './products.component.html', // HTML შაბლონის მისამართი
  styleUrls: ['./products.component.css'], // CSS ფაილის მისამართი
})
export class ProductsComponent implements OnInit {
  products: Product[] = []; // პროდუქტების მასივი

  // კატეგორიების სია
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
  selectedCategoryId: number | null = null; // არჩეული კატეგორიის ID

  // ფორმის კონტროლების მოდელის ცვლადები
  selectedNutsFilter: string = 'all'; // არჩეული თხილის ფილტრი
  selectedSpiciness: string = ''; // არჩეული სიცხარე
  isVegeterianChecked: boolean = false; // ვეგეტარიანული ფილტრის მდგომარეობა

  // ფილტრების ობიექტი API მოთხოვნისთვის
  filters = {
    categoryId: undefined as number | undefined, // კატეგორიის ID
    vegeterian: undefined as boolean | undefined, // ვეგეტარიანული
    nuts: undefined as boolean | undefined, // თხილის შემცველობა
    spiciness: undefined as number | undefined, // სიცხარე
  };

  constructor(
    private productService: ProductsService, // პროდუქტების სერვისი
    private basketService: BasketService // კალათის სერვისი
  ) {}

  ngOnInit() {
    this.applyFilters(); // ფილტრების გამოყენება კომპონენტის ჩატვირთვისას
    this.loadCategories(); // კატეგორიების ჩატვირთვა
  }

  // კატეგორიების ჩატვირთვის მეთოდი
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

  // პროდუქტების გაფილტვრა კატეგორიის მიხედვით
  fetchFilteredProducts(categoryId: number) {
    console.log('Fetching products for category:', categoryId);
    this.selectedCategoryId = categoryId; // არჩეული კატეგორიის დამახსოვრება
    this.filters.categoryId = categoryId > 0 ? categoryId : undefined; // თუ 0-ზე მეტია, მაშინ გამოიყენე კატეგორიის ID
    this.applyFilters(); // ფილტრების გამოყენება
  }

  // ფილტრის გადართვა მისი ტიპის მიხედვით
  toggleFilter(filterType: string, event: any, value?: string) {
    if (filterType === 'nuts') {
      // თხილის ფილტრი
      this.selectedNutsFilter = value || 'all'; // არჩეული ფილტრის მნიშვნელობის განახლება
      if (value === 'all') {
        this.filters.nuts = undefined; // ყველა პროდუქტის ჩვენება
      } else if (value === 'true') {
        this.filters.nuts = true; // მხოლოდ თხილის შემცველი პროდუქტები
      } else if (value === 'false') {
        this.filters.nuts = false; // მხოლოდ თხილის გარეშე პროდუქტები
      }
    } else if (filterType === 'vegeterian') {
      // ვეგეტარიანული ფილტრი
      this.isVegeterianChecked = event.target.checked; // ჩეკბოქსის მდგომარეობა
      this.filters.vegeterian = this.isVegeterianChecked; // ფილტრის განახლება
    } else if (filterType === 'spiciness') {
      // სიცხარის ფილტრი
      this.selectedSpiciness = event.target.value; // არჩეული სიცხარე
      this.filters.spiciness = this.selectedSpiciness
        ? parseInt(this.selectedSpiciness, 10) // სტრინგის რიცხვად გარდაქმნა
        : undefined; // თუ არცერთი არაა არჩეული, undefined იქნება
    }

    this.applyFilters(); // ფილტრების გამოყენება
  }

  // ფილტრების გადატვირთვა
  resetFilters() {
    this.filters = {
      categoryId:
        this.selectedCategoryId && this.selectedCategoryId > 0
          ? this.selectedCategoryId // შეინარჩუნე არჩეული კატეგორია
          : undefined,
      vegeterian: undefined, // ვეგეტარიანული ფილტრის გასუფთავება
      nuts: undefined, // თხილის ფილტრის გასუფთავება
      spiciness: undefined, // სიცხარის ფილტრის გასუფთავება
    };

    // მოდელის ცვლადების განულება
    this.selectedNutsFilter = 'all';
    this.selectedSpiciness = '';
    this.isVegeterianChecked = false;

    // ფილტრების გამოყენება
    this.applyFilters();
  }

  // ფილტრების გამოყენება API მოთხოვნისთვის
  applyFilters() {
    const params: any = {}; // პარამეტრების ობიექტი API მოთხოვნისთვის

    if (this.filters.categoryId !== undefined) {
      params.categoryId = this.filters.categoryId; // კატეგორიის ID-ის დამატება
    }

    if (this.filters.vegeterian !== undefined) {
      params.vegeterian = this.filters.vegeterian; // ვეგეტარიანული ფილტრის დამატება
    }

    if (this.filters.nuts !== undefined) {
      params.nuts = this.filters.nuts; // თხილის ფილტრის დამატება
    }

    if (this.filters.spiciness !== undefined) {
      params.spiciness = this.filters.spiciness; // სიცხარის ფილტრის დამატება
    }

    console.log('Applying filters with params:', params);
    this.productService.getFilteredProducts(params).subscribe(
      (data) => {
        console.log('Products received:', data);
        this.products = data; // მიღებული პროდუქტების განახლება
      },
      (error) => {
        console.error('Error fetching filtered products:', error); // შეცდომის გამოტანა
      }
    );
  }

  // კალათაში დამატების მეთოდი
  addToCart(product: Product, button?: HTMLButtonElement): void {
    console.log('Adding to cart:', product);

    // ღილაკის ვიზუალური უკუკავშირი
    if (button) {
      button.classList.add('adding'); // CSS კლასის დამატება ანიმაციისთვის
      button.textContent = 'Adding...'; // ტექსტის შეცვლა
    }

    this.basketService.addToBasket(product).subscribe(
      () => {
        console.log('Product added to cart successfully');
        this.showNotification(`✅ ${product.name} added to cart`, false, true); // წარმატების შეტყობინება

        // ღილაკის გადატვირთვა დაყოვნების შემდეგ
        setTimeout(() => {
          if (button) {
            button.classList.remove('adding'); // CSS კლასის წაშლა
            button.textContent = 'Add to cart'; // ტექსტის დაბრუნება
          }
        }, 500);
      },
      (error) => {
        console.error('Error adding to basket:', error);
        this.showNotification('❌ Failed to add to cart', true); // შეცდომის შეტყობინება

        // ღილაკის დაუყოვნებელი გადატვირთვა
        if (button) {
          button.classList.remove('adding');
          button.textContent = 'Add to cart';
        }
      }
    );
  }

  // შეტყობინების ჩვენების მეთოდი
  showNotification(
    message: string, // შეტყობინების ტექსტი
    isError: boolean = false, // არის თუ არა შეცდომა
    isCart: boolean = false // არის თუ არა კალათის შეტყობინება
  ): void {
    console.log('Showing notification:', message, isError);

    const notification = document.createElement('div'); // ახალი ელემენტის შექმნა
    notification.textContent = message; // შეტყობინების ტექსტის დამატება
    notification.className = isError
      ? 'notification error' // შეცდომის სტილი
      : isCart
      ? 'notification cart-success' // კალათის წარმატების სტილი
      : 'notification success'; // ჩვეულებრივი წარმატების სტილი

    document.body.appendChild(notification); // შეტყობინების დამატება DOM-ზე

    // 3 წამის შემდეგ ავტომატურად წაშლა
    setTimeout(() => {
      notification.classList.add('fade-out'); // გაქრობის ანიმაცია
      setTimeout(() => {
        document.body.removeChild(notification); // დოკუმენტიდან წაშლა
      }, 500);
    }, 3000);
  }
}
