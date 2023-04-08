import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { PageModule } from 'src/app/shared';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, PageModule],
  exports: [],
})
export class HomeModule {}
