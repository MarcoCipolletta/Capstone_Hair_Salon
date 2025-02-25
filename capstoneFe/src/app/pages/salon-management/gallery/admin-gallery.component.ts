import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { GalleryService } from '../../../services/gallery.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { iGalleryItem } from '../../../interfaces/i-gallery-item';

@Component({
  selector: 'app-gallery',
  templateUrl: './admin-gallery.component.html',
  styleUrl: './admin-gallery.component.scss',
})
export class AdminGalleryComponent {
  selectedFile!: File;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fullScreenModal', { static: true })
  fullScreenModal!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal', { static: true })
  confirmDeleteModal!: TemplateRef<any>;

  allImage: iGalleryItem[] = [];
  selectedImage: string = '';
  imageIdToDelete: string | null = null;
  isLoadingImage: boolean = false;

  constructor(private gallerySvc: GalleryService, private modalSvc: NgbModal) {
    this.gallerySvc.allImage$.subscribe((res) => {
      this.allImage = res;
    });
    this.gallerySvc.getAll().subscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    this.isLoadingImage = true;
    if (this.selectedFile) {
      this.gallerySvc.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.fileInput.nativeElement.value = '';
          this.selectedFile = null as any;
          this.isLoadingImage = false;
          this.gallerySvc.getAll().subscribe();
        },
      });
    } else {
      this.isLoadingImage = false;
    }
  }

  openFullScreenModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
    this.modalSvc.open(this.fullScreenModal, { size: 'xl', centered: true });
  }

  deleteImage(id: string): void {
    this.imageIdToDelete = id;
    this.modalSvc.open(this.confirmDeleteModal, { centered: true });
    // per eliminare l'autofocus sui bottoni del modale
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 0);
  }

  confirmDeletion(modalRef: NgbModalRef): void {
    if (this.imageIdToDelete) {
      this.gallerySvc.deleteImage(this.imageIdToDelete).subscribe({
        next: (res) => {
          const modalRef = this.modalSvc.open(ModalComponent, {
            windowClass: 'custom-success-modal',
          });
          modalRef.componentInstance.message = res.message;
          this.gallerySvc.getAll().subscribe();
        },
      });
      modalRef.close();
      this.imageIdToDelete = null;
    }
  }
}
