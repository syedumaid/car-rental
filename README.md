# Assignment 2 - Internet Programming
This repo is part of Assignment 2 for Internet Programming for University of Technology Sydney

## Project Specifications

This project simulates an online car rental platform where users can:
Browse a wide selection of cars in a responsive grid layout

Search and filter cars by **brand**, **model**, and **car type**

View **real-time keyword suggestions** as they type

Select a car and proceed to a reservation form

Fill out validated form details (name, phone, email, license, rental dates)

See the **total rental price** calculated automatically

Submit the reservation and view a **confirmation page

## Live Webpage

https://car-rental-indol-five.vercel.app/

## Features Implemented

### Homepage
- [x] Logo visible and clickable on all major pages
- [x] Responsive car grid layout
- [x] Live keyword search (brand, model, type only)
- [x] Dropdown filters for car type and brand
- [x] "Reset Filters" button to restore view
- [x] Unavailable cars show disabled "Rent" button

### Search and Filter
- [x] Real-time suggestions from JSON data
- [x] Combined filtering (e.g. Sedan + Toyota + keyword)

### Reservation Page
- [x] Prefills the last selected car
- [x] Shows form only if the car is available
- [x] Form inputs are validated with live feedback
- [x] Rental days and price calculated on date input
- [x] Form preserves user input on page reload
- [x] Cancel button clears form and returns to homepage

### Confirmation Page
- [x] Displays confirmed booking with details
- [x] Stored reservation data from form submission
- [x] Links back to homepage

### Data Handling
- [x] Cars and orders loaded via AJAX from JSON files
- [x] Reservations simulated using `localStorage`
 
## Acknowledgement
Project built by Umaid Ahmed Syed
