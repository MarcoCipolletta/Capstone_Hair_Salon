package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.customer.CustomerSvc;
import it.epicode.hair_salon.entities.operator.Operator;
import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.operator.dto.AvailabilityResult;
import it.epicode.hair_salon.entities.reservation.dto.ReservationCreateRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class ReservationSvc {
    private final ReservationRepository reservationRepo;
    private final CustomerSvc customerSvc;
    private final OperatorSvc operatorSvc;

    public List<Reservation> findAll() {
        return reservationRepo.findAll();
    }

    @Transactional
    public Reservation createReservation(@Valid ReservationCreateRequest reservationCreateRequest) {
        Customer customer = customerSvc.findById(reservationCreateRequest.getCustomerId());
        AvailabilityResult availabilityResult = operatorSvc.checkOperatorAvailability(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime()
        );

        Operator operator = availabilityResult.getOperator();
        boolean crossesLunchBreak = availabilityResult.isCrossesLunchBreak();
        boolean exceedsClosingTime = availabilityResult.isExceedsClosingTime();

        Reservation reservation = new Reservation();
        reservation.setDate(reservationCreateRequest.getDate());
        reservation.setOperator(operator);

        // Imposta lo stato basato sui flag
        if (crossesLunchBreak || exceedsClosingTime) {
            reservation.setStatus(Status.PENDING);
        } else {
            reservation.setStatus(Status.CONFIRMED);
        }

        reservation.setEndTime(reservationCreateRequest.getEndTime());
        reservation.setCustomer(customer);
        reservation.setStartTime(reservationCreateRequest.getStartTime());
        reservation.setSalonServices(reservationCreateRequest.getSalonServices());


        return reservationRepo.save(reservation);
    }


}
