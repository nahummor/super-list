import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCheckboxModule,
  MatCardModule,
  MatSelectModule,
  MatTooltipModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatBadgeModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule
  ]
})
export class MaterialModule {}
