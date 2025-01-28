package it.epicode.hair_salon.booking_service;

import it.epicode.hair_salon.booking_service.dto.BookingCheckAvaibleTimeRequest;
import it.epicode.hair_salon.booking_service.dto.DayWithAvaibleTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingSvc bookingSvc;

    @PostMapping
    public ResponseEntity<DayWithAvaibleTime> getDayWithAvaiableTime(@RequestBody BookingCheckAvaibleTimeRequest bookingCheckAvaibleTimeRequest){
        return new ResponseEntity<>(bookingSvc.getDayWithAvaibleTime(
                bookingCheckAvaibleTimeRequest.getDate(),
                bookingCheckAvaibleTimeRequest.getServices()
        ), HttpStatus.OK);
    }
}
