CREATE SCHEMA IF NOT EXISTS PUBLIC;
create table authorities (id  bigserial not null, name varchar(255), primary key (id));
create table users (id  bigserial not null, cpf VARCHAR(11), enabled boolean, name varchar(255), password varchar(255), created_at timestamp, updated_at timestamp, username varchar(255), primary key (id));
create table users_groups (user_id int8 not null, group_id int8 not null);
create table groups (id  bigserial not null, name varchar(255), primary key (id));
create table groups_authorities (group_id int8 not null, authority_id int8 not null);
alter table users_groups add constraint FKggimqo8cv8s5p5wcjmlioodyw foreign key (group_id) references groups;
alter table users_groups add constraint FKg6fu0mfuj9eqfd9aro1nc40nn foreign key (user_id) references users;

create table bank_accounts(
    id  bigserial not null,
    account_number varchar(255),
    balance float,
    created_at timestamp,
    updated_at timestamp,
    user_id bigint not null,
    foreign key (user_id) references users,
    primary key (id));


INSERT INTO users(
	enabled, name, password, username, cpf)
	VALUES (true, 'Admin', '$2a$10$8xRgONqHa9Zp0UqmaYqARutHWnHFTxFXFmeQs.rx/IARmn08aF2W2', 'admin@test.com', '21045387002');

INSERT INTO bank_accounts(account_number, balance, user_id) VALUES ('123456', 50.0, 1) ;

INSERT INTO authorities (name) VALUES('Admin');
INSERT INTO authorities (name) VALUES('Common');
INSERT INTO groups (name) VALUES('Admin');
INSERT INTO groups (name) VALUES('User');
INSERT INTO groups_authorities (group_id, authority_id) VALUES(1, 1);
INSERT INTO groups_authorities (group_id, authority_id) VALUES(1, 2);
INSERT INTO groups_authorities (group_id, authority_id) VALUES(2, 2);
INSERT INTO users_groups (user_id, group_id) VALUES(1, 1);