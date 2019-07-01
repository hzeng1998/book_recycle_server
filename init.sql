create DATABASE IF NOT EXISTS book_recycle;
USE book_recycle;
create TABLE IF NOT EXISTS user (
email varchar(255) not null,
username varchar(45),
password varchar(45) not null,
status tinyint default 0,
registerDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NUll,
PRIMARY KEY (email));

create TABLE if not exists `trade` (
  `type` TINYINT NOT NULL DEFAULT 0,
  `owner` VARCHAR(255) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `trader` VARCHAR(255) NULL,
  `price` DOUBLE NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `intro` VARCHAR(255) NOT NULL,
  `src` VARCHAR(60) NOT NULL,
    FOREIGN KEY (`owner`) REFERENCES `user` (`email`) ON delete CASCADE ON update CASCADE,
    FOREIGN KEY (`trader`) REFERENCES `user` (`email`) ON delete CASCADE ON update CASCADE
    );

create TABLE `book_recycle`.`trade_order` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `trade_id` INT(11) NOT NULL,
  `price` DOUBLE NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `way` TINYINT NOT NULL,
  `buyer` VARCHAR(255) NOT NULL,
  `seller` VARCHAR(255) NOT NULL,
  `status` TINYINT ZEROFILL NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `trader_id_idx` (`trade_id` ASC),
  INDEX `buyer_idx` (`buyer` ASC),
  INDEX `seller_idx` (`seller` ASC),
  CONSTRAINT `trader_id`
    FOREIGN KEY (`trade_id`)
    REFERENCES `book_recycle`.`trade` (`id`)
    ON delete CASCADE
    ON update CASCADE,
  CONSTRAINT `buyer`
    FOREIGN KEY (`buyer`)
    REFERENCES `book_recycle`.`user` (`email`)
    ON delete CASCADE
    ON update CASCADE,
  CONSTRAINT `seller`
    FOREIGN KEY (`seller`)
    REFERENCES `book_recycle`.`user` (`email`)
    ON delete CASCADE
    ON update CASCADE);

create table if not exists message_log (
    sender varchar(255) not null,
    receiver varchar(255) not null,
    message varchar(255) not null,
    sendDate DATETIME DEFAULT CURRENT_TIMESTAMP not null,
    foreign key(sender) references user(email) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(receiver) references user(email) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `book_recycle`.`info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `read` TINYINT ZEROFILL NOT NULL,
  `type` TINYINT ZEROFILL NOT NULL,
  `receiver` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `receiver_idx` (`receiver` ASC),
  CONSTRAINT `receiver`
    FOREIGN KEY (`receiver`)
    REFERENCES `book_recycle`.`user` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
