package it.epicode.hair_salon.entities.gallery_item;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/gallery")
@RequiredArgsConstructor
public class GalleryItemController {
    private final GalleryItemSvc galleryItemSvc;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file)  {
        String message = galleryItemSvc.uploadFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable UUID id) {
        String message = galleryItemSvc.deleteFile(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<List<GalleryItem>> getAll() {
        return new ResponseEntity<>( galleryItemSvc.findAll(), HttpStatus.OK);
    }


}
