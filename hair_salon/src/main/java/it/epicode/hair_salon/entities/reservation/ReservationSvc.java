package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.auth.AuthUserSvc;
import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.customer.CustomerSvc;
import it.epicode.hair_salon.entities.manager_schedule.ManagerScheduleSvc;
import it.epicode.hair_salon.entities.operator.Operator;
import it.epicode.hair_salon.entities.operator.OperatorSvc;
import it.epicode.hair_salon.entities.operator.dto.AvailabilityResult;
import it.epicode.hair_salon.entities.reservation.dto.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class ReservationSvc {
    private final ReservationRepository reservationRepo;
    private final AuthUserSvc authUserSvc;
    private final CustomerSvc customerSvc;
    private final OperatorSvc operatorSvc;
    private final ManagerScheduleSvc managerScheduleSvc;
    private final ReservationMapper reservationMapper;

    public List<ReservationResponse> findAll() {
        List<Reservation> reservations = reservationRepo.findAll();
        return reservationMapper.toReservationResponseList(reservations);
    }

    public Page<ReservationResponse> findAllPageable(Pageable pageable) {
        Page<Reservation> reservations = reservationRepo.findAll(pageable);
        return reservations.map(reservationMapper::toReservationResponse);
    }

    public Page<ReservationResponse> findByCustomerId(UUID customerId, Pageable pageable) {
        Page<Reservation> reservations = reservationRepo.findByCustomerIdOrderByDateDesc(customerId, pageable);
        return reservations.map(reservationMapper::toReservationResponse);
    }

    public Page<ReservationResponse> findByStatus(Status status, Pageable pageable) {
        Page<Reservation> reservations = reservationRepo.findByStatusOrderByDateDesc(status, pageable);
        return reservations.map(reservationMapper::toReservationResponse);
    }

    public Page<ReservationResponse> findBySalonServicesId(UUID salonServicesID, Pageable pageable) {
        Page<Reservation> reservations = reservationRepo.findBySalonServicesIdOrderByDateDesc( salonServicesID, pageable);
        return reservations.map(reservationMapper::toReservationResponse);
    }

    public List<ReservationResponse> findConfirmedAndPending() {
        List<Reservation> reservations = reservationRepo.findByStatusInOrderByDateAsc(List.of(Status.CONFIRMED, Status.PENDING));
        return reservationMapper.toReservationResponseList(reservations);

    }

    public ReservationResponse updateStatus(UUID id, Status status) {
        Reservation reservation = findById(id);
        reservation.setStatus(status);
        reservationRepo.save(reservation);
        return reservationMapper.toReservationResponse(reservation);
    }


    public Reservation findById(UUID id) {
        return reservationRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Prenotazione non trovata"));
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

        if (managerScheduleSvc.existsHolidayByDate(reservationCreateRequest.getDate()))
            throw new IllegalArgumentException("Il salone è in ferie per quella data.");
        if (managerScheduleSvc.existsOverlappingSchedules(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime()))
            throw new IllegalArgumentException("L'orario scelto non è disponibile");


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
        }
        return "Prenotazione confermata";
    }

    public String createReservationByAdminWithExistingCustomer(@Valid ReservationCreateRequest reservationCreateRequest, UUID customerId) {
        Customer customer = customerSvc.findById(customerId);
        AvailabilityResult availabilityResult = operatorSvc.checkOperatorAvailability(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime()
        );

        if (managerScheduleSvc.existsHolidayByDate(reservationCreateRequest.getDate()))
            throw new IllegalArgumentException("Il salone è in ferie per quella data.");
        if (managerScheduleSvc.existsOverlappingSchedules(
                reservationCreateRequest.getDate(),
                reservationCreateRequest.getStartTime(),
                reservationCreateRequest.getEndTime()))
            throw new IllegalArgumentException("L'orario scelto non è disponibile");


        Operator operator = availabilityResult.getOperator();

        Reservation reservation = new Reservation();
        reservation.setDate(reservationCreateRequest.getDate());
        reservation.setOperator(operator);

        reservation.setStatus(Status.CONFIRMED);


        reservation.setEndTime(reservationCreateRequest.getEndTime());
        reservation.setCustomer(customer);
        reservation.setStartTime(reservationCreateRequest.getStartTime());
        reservation.setSalonServices(reservationCreateRequest.getSalonServices());

        //Aggiungere invio email al cliente

        reservationRepo.save(reservation);

        return "Prenotazione inserita";

    }

    public String createCustomerForReservationByAdmin(@Valid ReservationAndCustomerCreateByAdminRequest reservationAndCustomerCreateByAdminRequest) {
        UUID customerId = authUserSvc.createCustomer(reservationAndCustomerCreateByAdminRequest.getCustomer());
        return createReservationByAdminWithExistingCustomer(reservationAndCustomerCreateByAdminRequest.getReservation(), customerId);
    }


    public boolean existsByDate(LocalDate date) {
        return reservationRepo.existsByDate(date);
    }

    public List<ReservationResponseForCustomer> findAllByLoggedCustomer(User userDetails) {
        Customer customer = customerSvc.findByAuthUserUsername(userDetails.getUsername());

        List<Reservation> reservations = reservationRepo.findByCustomerIdOrderByDateDesc(customer.getId());
        return reservationMapper.toReservationResponseForCustomerList(reservations);

    }

    public ReservationResponseForCustomer cancelReservationByCustomer(UUID reservationId, User userDetails) {
        Customer customer = customerSvc.findByAuthUserUsername(userDetails.getUsername());
        Reservation reservation = findById(reservationId);
        if (!reservation.getCustomer().getId().equals(customer.getId()))
            throw new IllegalArgumentException("Non hai il permesso di annullare questa prenotazione");
        reservation.setStatus(Status.CANCELLED);
        reservationRepo.save(reservation);
        return reservationMapper.toReservationResponseForCustomer(reservation);

    }


}
