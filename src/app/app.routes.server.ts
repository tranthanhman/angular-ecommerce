import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes - có thể prerender
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'cart',
    renderMode: RenderMode.Server // Hoặc Prerender nếu không cần dynamic data
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  // Dynamic routes - sử dụng server-side rendering
  {
    path: 'product/:id',
    renderMode: RenderMode.Server
  },
  // Fallback cho các routes khác
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
