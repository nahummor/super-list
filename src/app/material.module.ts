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
  MatBadgeModule,
  MatChipsModule,
  MatProgressBarModule,
  MatMenuModule
} from '@angular/material';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    MatBadgeModule,
    MatChipsModule,
    MatProgressBarModule,
    ScrollDispatchModule,
    MatMenuModule,
    DragDropModule
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
    MatBadgeModule,
    MatChipsModule,
    MatProgressBarModule,
    ScrollDispatchModule,
    MatMenuModule,
    DragDropModule
  ]
})
export class MaterialModule {}
