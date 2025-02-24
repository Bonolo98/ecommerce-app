import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: true,
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  productId: number;
  userId!: number;
  showDescription: boolean = false;
  reviews: any[] = [];
  newReview = { rating: 0, comment: '' };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router
  ) {
    this.productId = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.fetchProductDetails(this.productId);
    this.fetchReviews(this.productId);

    this.getUserId();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(Number(id)).subscribe((data) => {
        this.product = data;
      });
    }
  }

  getUserId() {
    this.userId = this.authService.getUserId() as number;
  }
  

  addToCart(productId: number) {
    if (this.userId) {
      this.cartService.addToCart(this.userId, productId).subscribe(() => {
        console.log('Product added to cart successfully');
      });
    } else {
      this.cartService.addToCart(null, productId).subscribe(() => {
        console.log('Product added to local cart');
      });
    }
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }



  fetchProductDetails(productId: number) {
    this.productService.getProductById(productId).subscribe(
      (data) => {
        this.product = data;
      },
      (error) => console.error('Error fetching product:', error)
    );
  }

  fetchReviews(productId: number) {
    this.reviewService.getReviewsByProduct(productId).subscribe(
      (data) => {
        this.reviews = data.reviews || [];
      },
      (error) => console.error('Error fetching reviews:', error)
    );
  }

  submitReview() {
    if (!this.userId) {
      alert('Please Login')
      this.router.navigate(['/login']);
      return;
    }

    const reviewData = {
      productId: this.product.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    };

    this.reviewService.addReview(reviewData).subscribe(
      (response) => {
        console.log('Review added:', response);
        this.newReview = { rating: 0, comment: '' };
        this.fetchReviews(this.product.id);
      },
      (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error adding review:', error);
        }
      }
    );
  }

  setRating(value: number) {
    this.newReview.rating = value;
  }
}
