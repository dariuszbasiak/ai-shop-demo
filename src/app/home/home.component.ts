import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <header>
      <h1>Acme Shop</h1>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <h2>Discover Your Style</h2>
          <p>Explore our curated collection of modern clothing.</p>
          <a href="#categories" class="shop-now-button">Shop Now</a>
        </div>
      </section>

      <section id="categories" class="categories">
        <h2>Shop by Category</h2>
        <div class="category-grid">
          <a href="#" class="category-item">
            <img src="assets/tops.jpg" alt="Tops" />
            <span>Tops</span>
          </a>
          <a href="#" class="category-item">
            <!-- <img src="assets/bottoms.jpg" alt="Bottoms" /> -->
            <span>Bottoms</span>
          </a>
          <a href="#" class="category-item">
            <!-- <img src="assets/dresses.jpg" alt="Dresses" /> -->
            <span>Dresses</span>
          </a>
          <a href="#" class="category-item">
            <!-- <img src="assets/accessories.jpg" alt="Accessories" /> -->
            <span>Accessories</span>
          </a>
        </div>
      </section>
    </main>

    <footer>
      <p>&copy; Acme Shop. All rights reserved.</p>
    </footer>
  `,
  styles: [
    `
      header {
        background-color: #1a1a1a;
        color: white;
        text-align: center;
        padding: 1.5rem 0;
        font-weight: 600;
      }

      main {
        padding: 0;
      }

      .hero {
        /* background-image: linear-gradient(
            rgba(0, 0, 0, 0.5),
            rgba(0, 0, 0, 0.5)
          ), */
        /* url('assets/hero-bg.jpg'); Replace with your hero image */
        background-size: cover;
        background-position: center;
        color: white;
        text-align: center;
        padding: 10rem 0;
      }

      .hero-content {
        max-width: 800px;
        margin: 0 auto;
      }

      .hero h2 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }

      .shop-now-button {
        background-color: #007bff;
        color: white;
        padding: 1rem 2rem;
        text-decoration: none;
        border-radius: 5px;
        font-weight: 600;
        transition: background-color 0.3s ease;
      }

      .shop-now-button:hover {
        background-color: #0056b3;
      }

      .categories {
        text-align: center;
        padding: 4rem 2rem;
      }

      .category-grid {
        display: grid;
        // grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 2rem auto;
      }

      .category-item {
        text-decoration: none;
        color: #333;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .category-item:hover {
        transform: translateY(-5px);
      }

      .category-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .category-item span {
        display: block;
        padding: 1rem;
        font-weight: 600;
        background-color: #f9f9f9;
      }

      footer {
        background-color: #f0f0f0;
        text-align: center;
        padding: 1.5rem 0;
        border-top: 1px solid #ddd;
      }
    `,
  ],
})
export class HomeComponent {}
