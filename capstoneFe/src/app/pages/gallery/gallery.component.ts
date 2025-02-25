import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { iGalleryItem } from '../../interfaces/i-gallery-item';
import { GalleryService } from './../../services/gallery.service';
import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  images: iGalleryItem[] = [];
  constructor(
    private galleryService: GalleryService,
    private modalSvc: NgbModal
  ) {
    this.galleryService.getAll().subscribe({
      next: (res) => {
        this.images = res;
      },
    });
  }
  @ViewChild('fullScreenModal', { static: true })
  fullScreenModal!: TemplateRef<any>;
  selectedImage: string = '';
  openFullScreenModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
    this.modalSvc.open(this.fullScreenModal, { centered: true });
  }
}
