package it.epicode.hair_salon.entities.operator;

import it.epicode.hair_salon.entities.opening_hours.OpeningHours;
import it.epicode.hair_salon.entities.opening_hours.OpeningHoursSvc;
import it.epicode.hair_salon.entities.operator.dto.AvailabilityResult;
import it.epicode.hair_salon.entities.operator.dto.OperatorCreateRequest;
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

    //Qui mi creo una funzione per controllare se un operatore ha già una prenotazione nella data e nell'orario richiesto
    private boolean hasAlreadyReservation(Operator operator, LocalDate date, long startTime, long endTime) {
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

        return operators.stream().anyMatch(operator -> !hasAlreadyReservation(operator, date, startTime, endTime));
    }

    public AvailabilityResult checkOperatorAvailability(LocalDate date, long startTime, long endTime) {
        // Qui rifaccio i controlli per evitare che qualcuno provi ad inviare una prenotazione con orari modificati da quelli inviati
        List<Operator> operators = operatorRepo.findAll();
        if (operators.isEmpty()) {
            throw new EntityNotFoundException("Nessun operatore disponibile");
        }

        // Gestire le ferie e orari occupati dall'admin
        OpeningHours openingHours = openingHoursSvc.findByDay(date.getDayOfWeek());
        boolean crossesLunchBreak = openingHoursSvc.crossesLunchBreak(date, startTime, endTime);
        boolean exceedsClosingTime = endTime > openingHours.getClosingTime();
        if (
                startTime < openingHours.getOpeningTime() ||
                        startTime > openingHours.getClosingTime() ||
                        (startTime > openingHours.getLaunchBreakStartTime() && startTime < openingHours.getLaunchBreakEndTime())
        ){
            throw new EntityNotFoundException("Nessun operatore disponibile");
        }

            for (Operator operator : operators) {
                boolean isOccupied = hasAlreadyReservation(operator, date, startTime, endTime);

                if (!isOccupied) {
                    AvailabilityResult availabilityResult = new AvailabilityResult();
                    availabilityResult.setOperator(operator);
                    availabilityResult.setCrossesLunchBreak(crossesLunchBreak);
                    availabilityResult.setExceedsClosingTime(exceedsClosingTime);
                    return availabilityResult;
                }
            }

        throw new EntityNotFoundException("Nessun operatore disponibile");
    }


    @Transactional
    public Operator update(Operator o) {
        return operatorRepo.save(o);
    }
}
