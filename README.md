# Angular E-commerce Application

A modern e-commerce application built with Angular 19, featuring server-side rendering (SSR), reactive state management with Angular Signals, and a responsive design with Tailwind CSS.

## 🌐 Live API

This application uses the **FreeAPI** service for backend functionality:
- **API Documentation**: [https://freeapi.hashnode.space/](https://freeapi.hashnode.space/)
- **Base URL**: `https://api.freeapi.app/api/v1/ecommerce`
- **Features**: Product management, user authentication, cart operations

## 📱 Application Structure

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | ProductListComponent | Homepage with product catalog |
| `/product/:id` | ProductDetailComponent | Individual product details |
| `/cart` | CartComponent | Shopping cart management |
| `/login` | LoginComponent | User authentication |

### Key Features

- 🛍️ **Product Catalog**: Browse and search products
- 🔍 **Product Details**: Detailed product information with images
- 🛒 **Shopping Cart**: Add/remove items, quantity management
- 👤 **User Authentication**: Login/logout functionality
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ⚡ **Server-Side Rendering**: Optimized for SEO and performance
- 🔄 **Reactive State Management**: Angular Signals for real-time updates

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   ├── core/
│   │   ├── guard/           # Route guards (AuthGuard)
│   │   └── interceptor/     # HTTP interceptors (AuthInterceptor)
│   ├── layouts/
│   │   ├── header/          # Navigation header
│   │   └── footer/          # Application footer
│   ├── models/              # TypeScript interfaces
│   │   ├── auth.model.ts
│   │   ├── cart.model.ts
│   │   └── product.model.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── login/       # Login component
│   │   │   └── register/    # Registration (placeholder)
│   │   ├── cart/
│   │   │   ├── cart-item/   # Individual cart item component
│   │   │   ├── cart.component.ts # Cart management
│   │   │   └── order-summary/ # Order summary component
│   │   └── product/
│   │       ├── product-card/    # Product preview card
│   │       ├── product-detail/  # Product details view
│   │       └── product-list/    # Product catalog
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts      # Authentication management
│   │   ├── cart.service.ts      # Cart state management
│   │   └── product.service.ts   # Product data operations
│   ├── shared/
│   │   └── components/
│   │       └── ui/
│   │           └── button/  # Reusable button component
│   └── utils/
│       └── api.ts           # API configuration and types
```

This updated README provides:

1. **Clear project overview** with key features
2. **Detailed page structure** with routing information  
3. **API documentation** referencing the FreeAPI service
4. **Complete project architecture** breakdown
5. **Technology stack** information
6. **Setup and deployment** instructions
7. **Development workflow** guidelines
8. **Performance optimizations** details

The README is comprehensive, professional, and gives developers everything they need to understand and work with the project.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v19.2.15)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd angular-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Build for Production

```bash
# Standard build
ng build

# Build with SSR
ng build --configuration=production
```

## 🛠️ Technology Stack

- **Framework**: Angular 19
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with fetch API
- **Routing**: Angular Router with guards
- **SSR**: Angular Universal
- **Icons**: Emoji-based icons
- **API**: FreeAPI (https://freeapi.hashnode.space/)

## 🔧 Key Features Implementation

### Reactive State Management
- Uses Angular Signals for real-time cart updates
- Computed values for item counts and totals
- Platform-aware localStorage handling for SSR compatibility

### Authentication
- JWT token-based authentication
- Route guards for protected pages
- HTTP interceptors for automatic token attachment
- Persistent login state

### Cart Management
- Guest cart (localStorage) vs authenticated cart (server)
- Real-time quantity updates
- Automatic cart synchronization
- SSR-compatible implementation

### Performance Optimizations
- Server-side rendering for better SEO
- Lazy loading for route modules
- HttpClient with fetch API for better SSR performance
- Optimized change detection with OnPush strategy

## 🌍 API Integration

### Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | Fetch product catalog |
| `/products/:id` | GET | Get product details |
| `/cart` | GET | Get user's cart |
| `/cart/item/:id` | POST | Add item to cart |
| `/cart/item/:id` | DELETE | Remove item from cart |
| `/users/login` | POST | User authentication |

### Authentication Flow
1. User submits login credentials
2. Server returns JWT token
3. Token stored in localStorage
4. HTTP interceptor adds token to requests
5. Route guards protect authenticated routes

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Real-time Updates**: Cart updates without page refresh
- **SEO Optimized**: Server-side rendering for better search visibility

## 📝 Development Commands

```bash
# Development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run linting
ng lint

# Generate component
ng generate component component-name

# Generate service
ng generate service service-name
```

## 🚀 Deployment

The application supports both client-side and server-side rendering:

1. **Static Hosting** (Client-side only)
   ```bash
   ng build
   # Deploy dist/ folder to any static hosting
   ```

2. **SSR Deployment** (Recommended)
   ```bash
   ng build --configuration=production
   # Deploy with Node.js server support
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Resources

- [Angular Documentation](https://angular.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FreeAPI Documentation](https://freeapi.hashnode.space/)
- [Angular Universal (SSR)](https://angular.dev/guide/ssr)
