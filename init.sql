CREATE DATABASE IF NOT EXISTS `book_recycle`;

USE `book_recycle`;

CREATE TABLE `user` (
  `email` varchar(255) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0',
  `registerDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_photo` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `trade` (
  `order_type` tinyint(4) unsigned zerofill NOT NULL,
  `owner` varchar(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trader` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `title` varchar(45) NOT NULL,
  `intro` varchar(255) NOT NULL,
  `src` varchar(60) NOT NULL,
  `writer` varchar(255) NOT NULL,
  `fineness` double NOT NULL,
  `url` varchar(255) NOT NULL,
  `type` tinyint(4) unsigned zerofill NOT NULL,
  `isbn` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trade_ibfk_1` (`owner`),
  KEY `trade_ibfk_2` (`trader`),
  CONSTRAINT `trade_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trade_ibfk_2` FOREIGN KEY (`trader`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

CREATE TABLE `trade_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trade_id` int(11) NOT NULL,
  `price` double NOT NULL,
  `address` varchar(255) NOT NULL,
  `way` tinyint(4) NOT NULL,
  `buyer` varchar(255) NOT NULL,
  `seller` varchar(255) NOT NULL,
  `status` tinyint(3) unsigned zerofill NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trader_id_idx` (`trade_id`),
  KEY `buyer_idx` (`buyer`),
  KEY `seller_idx` (`seller`),
  CONSTRAINT `buyer` FOREIGN KEY (`buyer`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `seller` FOREIGN KEY (`seller`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trader_id` FOREIGN KEY (`trade_id`) REFERENCES `trade` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

CREATE TABLE `message_log` (
  `sender` varchar(255) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `sendDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `sender` (`sender`),
  KEY `receiver` (`receiver`),
  CONSTRAINT `message_log_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_log_ibfk_2` FOREIGN KEY (`receiver`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `read` tinyint(3) NOT NULL DEFAULT '0',
  `type` tinyint(3) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `infoDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `receiver_idx` (`receiver`),
  CONSTRAINT `receiver` FOREIGN KEY (`receiver`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;