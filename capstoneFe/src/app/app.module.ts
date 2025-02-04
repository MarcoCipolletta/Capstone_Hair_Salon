import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './main-component/header/header.component';
import { FooterComponent } from './main-component/footer/footer.component';
import { NgIconsModule } from '@ng-icons/core';
import {
  iconoirEmojiSad,
  iconoirEye,
  iconoirEyeClosed,
  iconoirUser,
  iconoirXboxX,
} from '@ng-icons/iconoir';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './auth/token.interceptor';
import {
  akarCalendar,
  akarCircleMinus,
  akarCirclePlus,
  akarClock,
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
      iconoirXboxX,
      akarCalendar,
      akarClock,
      akarScissor,
      akarPeopleGroup,
    }),
    NgbDropdownModule,
  ],
  providers: [provideHttpClient(withInterceptors([tokenInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
