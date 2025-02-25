package it.epicode.hair_salon.entities.gallery_item;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class GalleryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String publicId;
   private String link;
   private String name;
}
