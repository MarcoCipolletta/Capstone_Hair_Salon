package it.epicode.hair_salon.entities.operator;

import it.epicode.hair_salon.entities.opening_hours.OpeningHours;
import it.epicode.hair_salon.entities.opening_hours.OpeningHoursSvc;
import it.epicode.hair_salon.entities.operator.dto.AvailabilityResult;
import it.epicode.hair_salon.entities.operator.dto.OperatorCreateRequest;
import it.epicode.hair_salon.entities.reservation.Reservation;
import it.epicode.hair_salon.entities.reservation.Status;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperatorSvc {
    private final OperatorRepository operatorRepo;
    private final OpeningHoursSvc openingHoursSvc;

    public String createOperator(OperatorCreateRequest operator) {
        Operator newOperator = new Operator();
        newOperator.setName(operator.getName());
        operatorRepo.save(newOperator);
        return "Operatore creato con successo";
    }

    public List<Operator> findAll() {
        return operatorRepo.findAll();
    }

    private boolean hasConflictingReservation(Operator operator, LocalDate date, long startTime, long endTime) {
        return operator.getReservations().stream()
                .anyMatch(reservation -> (reservation.getStatus().equals(Status.PENDING) ||
                        reservation.getStatus().equals(Status.CONFIRMED)) &&
                        reservation.getDate().equals(date) &&
                        reservation.getStartTime() < endTime &&
                        reservation.getEndTime() > startTime);
    }

    public boolean isOperatorAvailable(LocalDate date, Long startTime, Long endTime) {
        List<Operator> operators = operatorRepo.findAll();
        if (operators.isEmpty()) return false;

        return operators.stream().anyMatch(operator -> !hasConflictingReservation(operator, date, startTime, endTime));
    }

    public Operator findAvailableOperator(LocalDate date, long startTime, long endTime) {
        List<Operator> operators = operatorRepo.findAll();
        if (operators.isEmpty()) throw new EntityNotFoundException("Nessun operatore disponibile riga 53");

        return operators.stream()
                .filter(operator -> !hasConflictingReservation(operator, date, startTime, endTime))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Nessun operatore disponibile 65"));
    }


    public AvailabilityResult checkOperatorAvailability(LocalDate date, long startTime, long endTime) {
        List<Operator> operators = operatorRepo.findAll();
        if (operators.isEmpty()) {
            throw new EntityNotFoundException("Nessun operatore disponibile 64");
        }

        OpeningHours openingHours = openingHoursSvc.findByDay(date.getDayOfWeek());
        boolean crossesLunchBreak = openingHoursSvc.crossesLunchBreak(date, startTime, endTime);
        boolean exceedsClosingTime = endTime > openingHours.getClosingTime();

        for (Operator operator : operators) {
            boolean isOccupied = operator.getReservations().stream()
                    .anyMatch(reservation -> {
                        if (reservation.getStatus().equals(Status.PENDING) ||
                                reservation.getStatus().equals(Status.CONFIRMED)) {
                            return reservation.getDate().equals(date) &&
                                    reservation.getStartTime() < endTime &&
                                    reservation.getEndTime() > startTime;
                        }
                        return false;
                    });

            if (!isOccupied) {
                AvailabilityResult availabilityResult = new AvailabilityResult();
                availabilityResult.setOperator(operator);
                availabilityResult.setCrossesLunchBreak(crossesLunchBreak);
                availabilityResult.setExceedsClosingTime(exceedsClosingTime);
                return availabilityResult;
            }
        }

        throw new EntityNotFoundException("Nessun operatore disponibile 91");
    }


    @Transactional
    public Operator update(Operator o){
      return  operatorRepo.save(o);
    }
}
