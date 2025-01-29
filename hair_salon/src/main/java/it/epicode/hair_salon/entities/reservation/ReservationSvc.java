package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.customer.CustomerSvc;
import it.epicode.hair_salon.entities.manager_schedule.ManagerScheduleSvc;
import it.epicode.hair_salon.entities.operator.Operator;
import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.operator.dto.AvailabilityResult;
import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import it.epicode.hair_salon.entities.reservation.dto.ReservationMapper;
import it.epicode.hair_salon.entities.reservation.dto.ReservationResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class ReservationSvc {
    private final ReservationRepository reservationRepo;
    private final CustomerSvc customerSvc;
    private final OperatorSvc operatorSvc;
    private final ManagerScheduleSvc managerScheduleSvc;
    private final ReservationMapper reservationMapper;

    public List<ReservationResponse> findAll() {
        List<Reservation> reservations = reservationRepo.findAll();

        return reservationMapper.toReservationResponseList(reservations);
    }

    @Transactional
    public String createReservationByUser(@Valid ReservationCreateRequest reservationCreateRequest, User userDetails) {

        Customer customer = customerSvc.findByAuthUserUsername(userDetails.getUsername());
        // Aggiungere controllo che il cliente non abbia prenotazioni per quell'orario
        AvailabilityResult availabilityResult = operatorSvc.checkOperatorAvailability(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime()
        );

        if(managerScheduleSvc.existsHolidayByDate(reservationCreateRequest.getDate())) throw new IllegalArgumentException("Il salone è in ferie per quella data.");
        if(managerScheduleSvc.existsOverlappingSchedules(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime())) throw new IllegalArgumentException("L'orario scelto non è disponibile");


        Operator operator = availabilityResult.getOperator();
        boolean crossesLunchBreak = availabilityResult.isCrossesLunchBreak();
        boolean exceedsClosingTime = availabilityResult.isExceedsClosingTime();

        Reservation reservation = new Reservation();
        reservation.setDate(reservationCreateRequest.getDate());
        reservation.setOperator(operator);

        if (crossesLunchBreak || exceedsClosingTime) {
            reservation.setStatus(Status.PENDING);
        } else {
            reservation.setStatus(Status.CONFIRMED);
        }

        reservation.setEndTime(reservationCreateRequest.getEndTime());
        reservation.setCustomer(customer);
        reservation.setStartTime(reservationCreateRequest.getStartTime());
        reservation.setSalonServices(reservationCreateRequest.getSalonServices());

        //Aggiungere invio email al cliente

         reservationRepo.save(reservation);

         if (reservation.getStatus().equals(Status.PENDING)) {
             return "Prenotazione inviata e in attesa di conferma";
         } return "Prenotazione confermata";
    }

    public boolean existsByDate(LocalDate date) {
        return reservationRepo.existsByDate(date);
    }


}
