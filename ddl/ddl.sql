create database case_4;
create table case_4.points(
    latitude decimal(17, 14),
    longitude decimal(17, 14),
    name varchar(5000),
    description longtext,
    primary key (latitude, longitude)
);
