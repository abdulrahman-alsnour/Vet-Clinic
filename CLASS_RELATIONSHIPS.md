# Class Relationships - Simple Summary

## Main Relationships

**User** → owns many **Pets**  
**User** → places many **Orders**  
**User** → books many **Appointments**  
**User** → makes many **HotelReservations**

**Category** → contains many **Products**  
**Product** → appears in many **OrderItems**  
**Order** → contains many **OrderItems**

**Pet** → has many **Vaccinations**  
**Pet** → has many **Dewormings**  
**Pet** → has many **ClinicVisits**  
**Pet** → has many **WeightRecords**  
**Pet** → has many **HotelReservations**

**HotelRoom** → hosts many **HotelReservations**  
**HotelReservation** → belongs to one **HotelRoom**  
**HotelReservation** → belongs to one **User** (optional)  
**HotelReservation** → belongs to one **Pet** (optional)

**Appointment** → belongs to one **User** (optional)  
**Appointment** → belongs to one **Pet** (optional)

**Product** → has many **ProductViews** (for analytics)

**PetAdoption** and **PageView** are standalone (no relationships)

## Relationship Types

- **One-to-Many**: One parent has many children (e.g., User has many Pets)
- **Many-to-One**: Many children belong to one parent (e.g., many Orders belong to one User)
- **Optional**: Some relationships can be null (guest orders/appointments don't need a User)

## Cascade Deletes

When deleted, these automatically delete related records:
- **User** → deletes Pets, Appointments
- **Pet** → deletes Vaccinations, Dewormings, ClinicVisits, WeightRecords
- **Order** → deletes OrderItems
- **Category** → deletes Products
- **HotelRoom** → deletes HotelReservations
