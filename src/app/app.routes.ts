import { Routes } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { BasketComponent } from './basket/basket.component';
import { HomePageComponent } from './component/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
   
  },
  { path: 'basket', component: BasketComponent },
];
