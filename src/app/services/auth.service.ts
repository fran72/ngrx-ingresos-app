import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, authState } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Observable, Subscription, map } from 'rxjs';
import Swal from 'sweetalert2';
import { ActiveUser } from '../models/user.model';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData  } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = user(this.auth);
  userSubscription: Subscription;
  
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;
  
  item$: Observable<ActiveUser[]>;
  firestore: Firestore = inject(Firestore);
  
  constructor(
    private auth: Auth,
  ){
    const itemCollection = collection(this.firestore, 'users');
    this.item$ = collectionData(itemCollection) as Observable<ActiveUser[]>;
    
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log('user changes...............', aUser);
    });
    
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      console.log('authState...............', aUser);
    });
  }
  
  createUser( nombre: string, email: string, password: string ){
    const auth = getAuth();
    
    return createUserWithEmailAndPassword(auth, email, password)
      .then(( {user }) => {
        
        const newUser = new ActiveUser( user.uid, nombre, user.email );
        
        this.addUser(newUser);
        
        return newUser;
      })
      .catch((error) => {
        const errorCode = error.code;
        if ( errorCode === 'auth/weak-password' ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password should be at least 6 characters!",
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
        if ( errorCode === 'auth/email-already-in-use' ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "That email is already in use!",
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
      });
  }
  
  async addUser( newUser: ActiveUser ){
    await addDoc(collection(this.firestore, 'users'), {...newUser} ).then((documentReference: DocumentReference) => {
        console.log('newUser added..............', documentReference);
    });
  }
  
  loginUser( email: string, password: string ){
    const auth = getAuth();
    
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log('new user loged......', user);
        return user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode......', errorCode);
        console.log('errorMessage......', errorMessage);
        // Swal.fire({
        //   icon: "error",
        //   title: error.code,
        //   text: error.message,
        // });
        
        switch( error.code ){
          case 'auth/invalid-email':
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please provide a valid Email!",
            });
            
          case 'auth/invalid-credential':
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Email or password are wrong!",
            });
        }
        
        // if ( errorCode === 'auth/invalid-email' ) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Oops...",
        //     text: "Please provide a valid Email!",
        //     // footer: '<a href="#">Why do I have this issue?</a>'
        //   });
        // }
        // if ( errorCode === 'auth/invalid-credential' ) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Oops...",
        //     text: "Email or password are wrong!",
        //     // footer: '<a href="#">Why do I have this issue?</a>'
        //   });
        // }
      });
  }
  
  logout() {
    return this.auth.signOut();
  }
  
  isAuth() {
    return this.authState$.pipe(
      map( fbUser => fbUser != null )
    )
  }
  
  
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
    this.authStateSubscription.unsubscribe();
  }
    
}
