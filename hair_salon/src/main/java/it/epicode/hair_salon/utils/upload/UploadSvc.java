package it.epicode.hair_salon.utils.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import it.epicode.hair_salon.entities.gallery_item.dto.CreateGalleryItem;
import it.epicode.hair_salon.exceptions.DeleteItemException;
import it.epicode.hair_salon.exceptions.MaxSizeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UploadSvc {

    @Autowired
    private Cloudinary cloudinary;

    public CreateGalleryItem uploadFile(MultipartFile file) {
        // Controllo dimensione file (es. massimo 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new MaxSizeException("File troppo grande, massimo 10MB");
        }
        Map uploadResult;
        try {
            uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "Galleria_Parrucchieria",
                    "resource_type", "auto",
                    "transformation", new Transformation().quality("auto:low"),
                    "filename", file.getOriginalFilename()));
        } catch (IOException e) {
            // Puoi loggare l'errore qui per ulteriori indagini
            throw new DeleteItemException("Errore durante l'upload del file");
        }

        CreateGalleryItem galleryItem = new CreateGalleryItem();
        galleryItem.setLink(uploadResult.get("url").toString());
        galleryItem.setName(file.getOriginalFilename());
        galleryItem.setPublicId(uploadResult.get("public_id").toString());
        return galleryItem;
    }

    public void deleteFile(String publicId) {
        try {
          cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new DeleteItemException("Errore durante l'eliminazione del file da Cloudinary");
        }
    }


}
