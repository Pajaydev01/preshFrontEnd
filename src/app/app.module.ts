import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './modals/auth/auth.component';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ProfileComponent } from './profile/profile.component';
import { SidebarModule } from 'primeng/sidebar';
import { RequestsComponent } from './modals/requests/requests.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProfileComponent,
    RequestsComponent
  ],
  imports: [
    InputTextareaModule,
    SidebarModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ToastModule,
    ConfirmDialogModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService,
    DynamicDialogConfig,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
