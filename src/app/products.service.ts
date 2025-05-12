import { Injectable } from '@angular/core'; // სერვისის დეკორატორის იმპორტი
import { HttpClient, HttpParams } from '@angular/common/http'; // HTTP კლიენტისა და პარამეტრების იმპორტი
import { Observable } from 'rxjs'; // Observable-ის იმპორტი ასინქრონული ოპერაციებისთვის
import { Product } from './models/products.model'; // პროდუქტის მოდელის იმპორტი

@Injectable({
  providedIn: 'root', // სერვისის მთელ აპლიკაციაში ხელმისაწვდომობა
})
export class ProductsService {
  private apiUrl = 'https://restaurant.stepprojects.ge/api/Products'; // API-ის მისამართი

  constructor(private http: HttpClient) {} // HTTP კლიენტის ინექცია

  // ყველა პროდუქტის მიღების მეთოდი
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetAll`); // HTTP GET მოთხოვნა
  }

  // გაფილტრული პროდუქტების მიღების მეთოდი
  getFilteredProducts(filters: any): Observable<Product[]> {
    console.log('Service getFilteredProducts called with filters:', filters);
    let params = new HttpParams(); // HTTP პარამეტრების ინიციალიზაცია

    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString()); // კატეგორიის ID-ის დამატება
      console.log('Added categoryId param:', filters.categoryId);
    }

    if (filters.nuts !== undefined) {
      params = params.set('nuts', filters.nuts.toString()); // თხილის ფილტრის დამატება
    }

    if (filters.vegeterian !== undefined) {
      params = params.set('vegeterian', filters.vegeterian.toString()); // ვეგეტარიანული ფილტრის დამატება
    }

    if (filters.spiciness !== undefined) {
      params = params.set('spiciness', filters.spiciness.toString()); // სიცხარის ფილტრის დამატება
    }

    console.log('Final params:', params.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/GetFiltered`, { params }); // HTTP GET მოთხოვნა პარამეტრებით
  }

  // პროდუქტის წაშლის გამოთიშული მეთოდი
  // deleteProduct(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  // }
}
