import {animate, state, style, transition, trigger} from '@angular/animations';

export const slideToRight = trigger('routerAnimate', [
  // * 表示任何状态,void 表示空状态
  state('void', style({
    position: 'absolute', width: '100%', height: '100%',
    opacity: 1, transform: 'translateX(0)'})),
  state('*', style({
    position: 'absolute', width: '100%', height: '100%',
    opacity: 1, transform: 'translateX(0)'})),
  transition(':enter', [
    style({opacity: 0, transform: 'translateX(30%)'}),
    animate('0.3s ease-out')
  ]),
  // transition(':leave', [
  //   animate('0.3s ease-in', style({
  //     opacity: 0
  //   }))
  // ])
])
