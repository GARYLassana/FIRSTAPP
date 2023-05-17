import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';

@Injectable({
  // Nous permet de n'est plus declarer le service dans "app-module"
  providedIn: 'root'
})
export class ProductService {
  private products!: Array<Product>;


  constructor() {
    this.products = [
      { id: UUID.UUID(), name: 'Computer', price: 1200, promotion: true },
      { id: UUID.UUID(), name: 'Printer', price: 2000, promotion: false },
      { id: UUID.UUID(), name: 'Smart phone', price: 7300, promotion: true },
    ]
    // Nous avons dupliquer juste notre tableau
    for (let i = 0; i < 5; i++) {
      this.products.push({ id: UUID.UUID(), name: 'Computer', price: 1200, promotion: true });
      this.products.push({ id: UUID.UUID(), name: 'Printer', price: 2000, promotion: false });
      this.products.push({ id: UUID.UUID(), name: 'Smart phone', price: 7300, promotion: true });
    }
  }

  /**
   * @file "Observable<Array<any>>" : permet d'utiliser la programmation asynchrone, c'est à dire le traitement ne s'arrête pas pour attendre la fin dun autre traitement
   * @file en utilisant "Observable" il faut retourner un objet de type observable dans "of()"
   * @returns
   */
  public getAllProducts(): Observable<Array<Product>> {
    return of(this.products);
  }

  /**
   * @file nous filtrons ici la liste de nos produits en ignorant l'elt supprimer et stocker tjrs dans "products" qui va constituer notre nveau produit sans l'elt supprimé
   * @param id
   * @returns
   */
  public deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter(p => p.id != id);
    return of(true);
  }

  /**
   * @file on parcourt les produits par son identifiant "this.products.find(p => p.id === id)", ensuite on verifie s'il existe on fait la comparaison sinon genere une erreur
   * @param id
   * @returns
   */
  public setPromotion(id: string): Observable<boolean> {
    let product = this.products.find(p => p.id === id);
    if (product != undefined) {
      product.promotion = !product.promotion;
      return of(true);
    } else {
      return throwError(() => new Error("Les produits n'existent pas"));
    }
  }


  /**
   * @file On fait une recherche par nom de produit en les filtra et inclure son formControlName
   * @param keyword
   * @returns
   */
  public searchProducts(keyword: string, page: number, size: number): Observable<PageProduct> {
    let result = this.products.filter(p => p.name.includes(keyword));
    let index = page * size;
    // "~~": permet de retourner une division sans virgule
    let totalPages = ~~(result.length / size);
    if (this.products.length % size != 0)
      totalPages++;
    let pageProducts = result.slice(index, index + size);
    return of({ page: page, size: size, totalPages: totalPages, products: pageProducts });
  }

  /**
   * @file La pagination
   * @param page
   * @param size
   * @returns
   */
  public getPageProducts(page: number, size: number): Observable<PageProduct> {
    let index = page * size;
    // "~~": permet de retourner une division sans virgule
    let totalPages = ~~(this.products.length / size);
    if (this.products.length % size != 0)
      totalPages++;
    let pageProducts = this.products.slice(index, index + size);
    return of({ page: page, size: size, totalPages: totalPages, products: pageProducts });
  }


  /**
   * @file ajout d'un nouveau produit : On ajout le nouveau produit en générant un nouveau id
   */
  public addNewProduct(product: Product): Observable<Product> {
    product.id = UUID.UUID();
    // products c'est la liste des produits crée dans le service
    this.products.push(product);
    return of(product);
  }

  /**
 * @file parametrage de message d'erreur sur le formulaire
 * @param fieldName
 * @param error
 * @returns
 */
  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']) {
      return fieldName + ' is Required';
    } else if (error['minLength']) {
      return fieldName + ' should have at least ' + error['minlength']['requiredLength'] + ' Characters';
    } else if (error['min']) {
      return fieldName + ' should have min value ' + error['min']['min'];
    } else return '';
  }

  /**
   * @file la récuperation d'un produit par son id enfin d'effectuer la modification
   */
  public getProduct(id: string): Observable<Product> {
    let product = this.products.find(p => p.id === id);
    if (product === undefined) return throwError(() => new Error("Le produit n'existe pas"))
    return of(product);
  }

  /**
   *
   * @param product
   * @returns
   */
  public updateProduct(product: Product): Observable<Product> {
    this.products = this.products.map(p => (p.id === product.id) ? product : p);
    return of(product);
  }
}
