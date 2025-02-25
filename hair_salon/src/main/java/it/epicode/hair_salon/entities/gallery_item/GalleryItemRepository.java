package it.epicode.hair_salon.entities.gallery_item;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface GalleryItemRepository extends JpaRepository<GalleryItem, UUID> {

    boolean existsByPublicId(String id);

    Optional<GalleryItem> findByPublicId(String id);
}
