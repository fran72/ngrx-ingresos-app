import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return authService.isAuth().pipe(
    tap((isAuth) => {
      console.log('pipe......', isAuth);
      // if (isAuth) true;  ...no hace falta
      if (!isAuth) router.navigateByUrl('/register');
    })
  );
    
};
