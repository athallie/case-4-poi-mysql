create database case_4;
create table case_4.points(
                              point_id int auto_increment primary key,
                              latitude decimal(17, 14),
                              longitude decimal(17, 14),
                              name varchar(5000),
                              description longtext
);
