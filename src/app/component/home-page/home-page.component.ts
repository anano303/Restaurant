import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Use RouterOutlet instead of RouterLink if you're not using links directly
import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../../products/products.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ProductsComponent], // Replace RouterLink with RouterOutlet
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {}
