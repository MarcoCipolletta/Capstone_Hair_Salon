package it.epicode.hair_salon.booking_service;

import it.epicode.hair_salon.booking_service.dto.AvailableTime;
import it.epicode.hair_salon.booking_service.dto.BookingCheckAvaibleTimeRequest;
import it.epicode.hair_salon.booking_service.dto.DayWithAvaibleTime;
import it.epicode.hair_salon.entities.manager_schedule.ManagerSchedule;
import it.epicode.hair_salon.entities.manager_schedule.ManagerScheduleSvc;
import it.epicode.hair_salon.entities.opening_hours.OpeningHours;
import it.epicode.hair_salon.entities.opening_hours.OpeningHoursSvc;
import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class BookingSvc {
    private final OperatorSvc operatorSvc;
    private final OpeningHoursSvc openingHoursSvc;
    private final ManagerScheduleSvc managerScheduleSvc;


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

        long currentTimeInSeconds = 0;
        if (date.isEqual(LocalDate.now())) {
            LocalTime now = LocalTime.now();
            currentTimeInSeconds = now.toSecondOfDay();
        }


        for (Long startTime : timeRanges) {

            // Se è oggi salto gli orari fino all'ora corrente
            if (date.isEqual(LocalDate.now()) && startTime <= currentTimeInSeconds) {
                continue;
            }

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
    public DayWithAvaibleTime getDayWithAvaibleTime(@Valid BookingCheckAvaibleTimeRequest bookingCheckAvaibleTimeRequest) {
        List<AvailableTime> availableTimeRanges = getAvailableTimeRangesFromDateAndServicesOfDay(bookingCheckAvaibleTimeRequest.getDate(), bookingCheckAvaibleTimeRequest.getServices());
        DayWithAvaibleTime dayWithAvaibleTime = new DayWithAvaibleTime();
        // Aggiugere controllo che il giorno non sia passato, non ci siano orari occupati dall' admin, o non ci siano ferie
        boolean isOnHoliday = managerScheduleSvc.existsHolidayByDate(bookingCheckAvaibleTimeRequest.getDate());
        boolean isThereBlockedSchedule = managerScheduleSvc.existsBlockedByDate(bookingCheckAvaibleTimeRequest.getDate());
        if (isOnHoliday) {
            dayWithAvaibleTime.setAvailableTimes(new ArrayList<>());
            List<ManagerSchedule> managerSchedules = managerScheduleSvc.findAllByDate(bookingCheckAvaibleTimeRequest.getDate());
            dayWithAvaibleTime.setManagerSchedules(managerSchedules);
        } else if (isThereBlockedSchedule) {
            List<AvailableTime> filteredAvailableTimeRanges = availableTimeRanges.stream()
                    .filter(availableTime -> !managerScheduleSvc.existsOverlappingSchedules(bookingCheckAvaibleTimeRequest.getDate(), availableTime.getStartTime(), availableTime.getEndTime()))
                    .toList();
            dayWithAvaibleTime.setAvailableTimes(filteredAvailableTimeRanges);
            List<ManagerSchedule> managerSchedules = managerScheduleSvc.findAllByDate(bookingCheckAvaibleTimeRequest.getDate());
            dayWithAvaibleTime.setManagerSchedules(managerSchedules);
        } else {
            dayWithAvaibleTime.setAvailableTimes(availableTimeRanges);
            dayWithAvaibleTime.setManagerSchedules(null);

        }


        dayWithAvaibleTime.setDate(bookingCheckAvaibleTimeRequest.getDate());
        dayWithAvaibleTime.setDayName(switch (bookingCheckAvaibleTimeRequest.getDate().getDayOfWeek()){
            case MONDAY -> "lun";
            case TUESDAY -> "mar";
            case WEDNESDAY -> "mer";
            case THURSDAY -> "gio";
            case FRIDAY -> "ven";
            case SATURDAY -> "sab";
            case SUNDAY -> "dom";
        });
        dayWithAvaibleTime.setDayNumber(bookingCheckAvaibleTimeRequest.getDate().getDayOfMonth() + "");
        dayWithAvaibleTime.setAvailable(!dayWithAvaibleTime.getAvailableTimes().isEmpty());
        return dayWithAvaibleTime;
        }

        public List<DayWithAvaibleTime> getWeekWithAvaibleTime(@Valid BookingCheckAvaibleTimeRequest bookingCheckAvaibleTimeRequest) {
            List<DayWithAvaibleTime> dayWithAvaibleTimes = new ArrayList<>();
            LocalDate startDate = bookingCheckAvaibleTimeRequest.getDate();
            for (int i = 0; i < 7; i++) {
                LocalDate date = startDate.plusDays(i);
                bookingCheckAvaibleTimeRequest.setDate(date);
                DayWithAvaibleTime dayWithAvaibleTime = getDayWithAvaibleTime(bookingCheckAvaibleTimeRequest);
                dayWithAvaibleTimes.add(dayWithAvaibleTime);
            }
            return dayWithAvaibleTimes;
        }



}
