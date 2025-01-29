package it.epicode.hair_salon.booking_service;

import it.epicode.hair_salon.booking_service.dto.AvailableTime;
import it.epicode.hair_salon.booking_service.dto.DayWithAvaibleTime;
import it.epicode.hair_salon.entities.opening_hours.OpeningHours;
import it.epicode.hair_salon.entities.opening_hours.OpeningHoursSvc;
import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.reservation.ReservationSvc;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import it.epicode.hair_salon.entities.salon_service.SalonServiceSvc;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingSvc {
    private final OperatorSvc operatorSvc;
    private final ReservationSvc reservationSvc;
    private final OpeningHoursSvc openingHoursSvc;
    private final SalonServiceSvc salonServiceSvc;


    //Qui tiro fuori tutti gli orari della giornata lavorativa e controllo che rietrino negli orari di apertura
    private List<Long> getTimesRangeOfDay(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        OpeningHours openingHours = openingHoursSvc.findByDay(dayOfWeek);
        Long openingTime = openingHours.getOpeningTime();
        Long launchBreakStartTime = openingHours.getLaunchBreakStartTime();
        Long launchBreakEndTime = openingHours.getLaunchBreakEndTime();
        Long closingTime = openingHours.getClosingTime();

        List<Long> timeRanges = new ArrayList<>();
        for (long i = openingTime; i < closingTime; i += (30 * 60)) {
            if (launchBreakStartTime == 0 && launchBreakEndTime == 0) {
                timeRanges.add(i);
            } else {
                if (i < launchBreakStartTime || i > launchBreakEndTime) {
                    timeRanges.add(i);
                }
            }
        }

        return timeRanges;
    }

    //Qui ritorno gli orari disponibili filtrando fra tutti quelli della giornata e in base alla disponibilità dell0 operator
    private List<AvailableTime> getAvailableTimeRangesFromDateAndServicesOfDay(LocalDate date, List<SalonService> salonServices) {
        Long totalServicesDuration = salonServices.stream().mapToLong(SalonService::getDuration).sum();

        List<Long> timeRanges = getTimesRangeOfDay(date);
        List<AvailableTime> availableTimeRanges = new ArrayList<>();
        for (Long startTime : timeRanges) {
            long endTime = startTime + totalServicesDuration;
            if (operatorSvc.isOperatorAvailable(date, startTime, endTime)) {
                AvailableTime availableTime = new AvailableTime();
                availableTime.setStartTime(startTime);
                availableTime.setEndTime(endTime);
                availableTimeRanges.add(availableTime);
            }
        }
        return availableTimeRanges;
    }

    //qui ritorno un oggetto con la giornata e la lista degli orari disponibili
    public DayWithAvaibleTime getDayWithAvaibleTime(LocalDate date, List<SalonService> salonServices) {
        // Aggiugere controllo che il giorno non sia passato, non ci siano orari occupati dall' admin, o non ci siano ferie

        List<AvailableTime> availableTimeRanges = getAvailableTimeRangesFromDateAndServicesOfDay(date, salonServices);
        DayWithAvaibleTime dayWithAvaibleTime = new DayWithAvaibleTime();
        dayWithAvaibleTime.setDate(date);
        dayWithAvaibleTime.setDayName(switch (date.getDayOfWeek()){
            case MONDAY -> "lun";
            case TUESDAY -> "mar";
            case WEDNESDAY -> "mer";
            case THURSDAY -> "gio";
            case FRIDAY -> "ven";
            case SATURDAY -> "sab";
            case SUNDAY -> "dom";
        });
        dayWithAvaibleTime.setDayNumber(date.getDayOfMonth() + "");
        dayWithAvaibleTime.setAvaiableTimes(availableTimeRanges);
        if (availableTimeRanges.isEmpty()) {
            dayWithAvaibleTime.setAvailable(false);
        } else {
            dayWithAvaibleTime.setAvailable(true);
        }
        return dayWithAvaibleTime;
        }



}
