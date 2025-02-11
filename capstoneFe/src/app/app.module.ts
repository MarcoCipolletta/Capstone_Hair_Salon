import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './main-component/header/header.component';
import { FooterComponent } from './main-component/footer/footer.component';
import { NgIconsModule } from '@ng-icons/core';
import {
  iconoirArrowLeftCircle,
  iconoirEmojiSad,
  iconoirEye,
  iconoirEyeClosed,
  iconoirXboxX,
} from '@ng-icons/iconoir';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './auth/token.interceptor';
import {
  akarArrowDownThick,
  akarArrowUpThick,
  akarCalendar,
  akarCircleMinus,
  akarCirclePlus,
  akarCircleX,
  akarClock,
  akarEdit,
  akarPeopleGroup,
  akarScissor,
} from '@ng-icons/akar-icons';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgIconsModule.withIcons({
      iconoirEye,
      iconoirEyeClosed,
      iconoirEmojiSad,
      akarCirclePlus,
      akarCircleMinus,
      akarCircleX,
      iconoirXboxX,
      akarCalendar,
      akarClock,
      akarScissor,
      akarPeopleGroup,
      akarEdit,
      akarArrowDownThick,
      akarArrowUpThick,
      iconoirArrowLeftCircle,
    }),
    NgbDropdownModule,
  ],
  providers: [provideHttpClient(withInterceptors([tokenInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
