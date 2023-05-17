import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../model/product.model';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  // On peut declarer une variable nulle de deux manières suivante : "products : Array<any> | undefined" ou "products! : Array<any>"
  products!: Array<Product>;
  errorMessage!: string;
  // Variable pour la recherche
  searchFormGroup!: FormGroup;
  currentAction: string = "all";
  // variable pour la pagination
  currentPage: number = 0;
  pageSize: number = 7;
  totalPages: number = 0;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {

    // Là je fais un twai baiding en gréant un groupe de l'ensemble de mes formGroupeName s'il y a beaucoup
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null)
    });

    // La pagination fait que nous appeleons plus :
    // this.handleGetAllProducts();
    this.handleGetPageProducts();

  }

  /**
  * @file nous avons créer une methode "handleGetAllProducts" qui fait un subscribe des donées contenus dans "getAllProducts()" de service "productService"
  */
  // handleGetAllProducts() {
  //   this.productService.getAllProducts().subscribe({
  //     next: (data) => {
  //       this.products = data;
  //     },
  //     error: err => {
  //       this.errorMessage = err;
  //     }
  //   });
  // }

  /**
   * @file après je fais un subscribe des donées contenus sans l'elt supprimé dans "deleteProduct()" de service "productService"
   * @file pour faire propre nous mettons un petit message de confirmation avant la suppression
   */
  handleDeleteProduct(p: Product) {
    let conf = confirm('Êtes-vous sûr de vouloir supprimer ?');
    if (conf === true) {
      this.productService.deleteProduct(p.id).subscribe({
        next: (data) => {
          let index = this.products.indexOf(p);
          this.products.splice(index, 1);
        }
      })
    }
  }

  /**
   * @file permet au click d'activer ou desactiver la promotion
   * @param p
   */
  handleSetPromotion(p: Product) {
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next: (data) => {
        p.promotion = !promo;
      },
      error: err => {
        this.errorMessage = err;
      }
    })
  }

  /**
   * @file la recherche
   */
  handleSearchProducts() {
    this.currentAction = "search";
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      }
    })
  }

  /**
  * @file la pagination
  */
  handleGetPageProducts() {
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }
  // Permet au click de rediriger vers la tab de navigation
  goToPage(i: number) {
    this.currentPage = i;
    if (this.currentAction === "all") {
      this.handleGetPageProducts();
    } else {
      this.handleSearchProducts();
    }
  }

  /**
   * @file En cliquant sur le bouton "New Produict" on se redirige vers la page d'ajout produit
   */
  handleNewProduct() {
    this.router.navigateByUrl('/admin/newProduct');
  }

  /**
   * @file En cliquant sur le bouton "Edit Produict" on se redirige vers la page d'edition produit
   */
  handleEditProduct(p: Product) {
    this.router.navigateByUrl('/admin/editProduct/' + p.id);
  }
}
