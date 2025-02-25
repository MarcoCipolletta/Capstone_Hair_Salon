package it.epicode.hair_salon.entities.gallery_item.dto;

import lombok.Data;

@Data
public class CreateGalleryItem {
    private String publicId;
    private String link;
    private String name;
}
