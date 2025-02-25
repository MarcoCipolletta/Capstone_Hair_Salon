package it.epicode.hair_salon.entities.gallery_item;

import com.fasterxml.jackson.databind.util.BeanUtil;
import it.epicode.hair_salon.entities.gallery_item.dto.CreateGalleryItem;
import it.epicode.hair_salon.utils.upload.UploadSvc;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor

public class GalleryItemSvc {
    private final GalleryItemRepository galleryItemRepo;
    private final UploadSvc uploadSvc;

    public List<GalleryItem> findAll() {
        return galleryItemRepo.findAll();
    }

    public String uploadFile(MultipartFile file) {
        CreateGalleryItem createGalleryItem = uploadSvc.uploadFile(file);
        GalleryItem galleryItem = new GalleryItem();
        BeanUtils.copyProperties(createGalleryItem, galleryItem);
        galleryItemRepo.save(galleryItem);
        return "File caricato con successo";
    }

    public GalleryItem findByPublicId(String publicId) {
        return galleryItemRepo.findByPublicId(publicId).orElseThrow(() -> new EntityNotFoundException("File non trovato"));
    }

    public String deleteFile(UUID id) {
        if (id == null || !galleryItemRepo.existsById(id)) {
            throw new EntityNotFoundException("File non trovato");
        }
  GalleryItem galleryItem = galleryItemRepo.findById(id).get();
        uploadSvc.deleteFile(galleryItem.getPublicId());
        galleryItemRepo.delete(galleryItem);
        return "File eliminato con successo";
    }

}
